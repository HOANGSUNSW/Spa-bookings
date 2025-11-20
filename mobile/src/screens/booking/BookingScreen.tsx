import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as apiService from '../../services/apiService';
import { Service, User } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

type Props = NativeStackScreenProps<any, 'Booking'>;

type PaymentMethod = 'VNPay' | 'Cash';

export const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId } = (route.params as { serviceId?: string }) || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [therapists, setTherapists] = useState<User[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setCurrentStep(2);
      }
    }
  }, [serviceId, services]);

  const loadData = async () => {
    try {
      const [servicesData, usersData, user] = await Promise.all([
        apiService.getServices(),
        apiService.getUsers(),
        apiService.getCurrentUser(),
      ]);
      setServices(servicesData.filter((s: Service) => s.isActive !== false));
      setTherapists(usersData.filter((u: User) => u.role === 'Staff'));
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleBooking = () => {
    if (!selectedService || !currentUser) {
      Alert.alert('Lỗi', 'Vui lòng chọn đầy đủ thông tin');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedService || !currentUser) return;

    try {
      setIsLoading(true);
      setShowPaymentModal(false);

      // Create appointment first
      const appointmentData = {
        serviceId: selectedService.id,
        userId: currentUser.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        therapistId: selectedTherapist || undefined,
        notes,
        status: 'pending' as const,
        paymentStatus: 'Unpaid' as const,
      };

      const appointment = await apiService.createAppointment(appointmentData);

      if (paymentMethod === 'VNPay') {
        // Create VNPay payment URL
        const amount = selectedService.price;
        const returnUrl = 'myapp://payment-result'; // Deep link for mobile
        
        const result = await apiService.createVNPayUrl(appointment.id, amount, returnUrl);
        
        if (result.paymentUrl) {
          // Open VNPay payment page in browser
          const supported = await Linking.canOpenURL(result.paymentUrl);
          if (supported) {
            await Linking.openURL(result.paymentUrl);
            Alert.alert(
              'Thanh toán VNPay',
              'Vui lòng hoàn tất thanh toán trên trình duyệt. Sau khi thanh toán, bạn có thể quay lại ứng dụng để kiểm tra lịch hẹn.',
              [
                { text: 'OK', onPress: () => navigation.navigate('AppointmentsTab') }
              ]
            );
          } else {
            throw new Error('Không thể mở link thanh toán');
          }
        }
      } else {
        // Cash payment
        Alert.alert(
          'Đặt lịch thành công!',
          'Vui lòng thanh toán tại quầy khi đến spa.',
          [{ text: 'OK', onPress: () => navigation.navigate('AppointmentsTab') }]
        );
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      Alert.alert('Lỗi', 'Đặt lịch thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Step 1: Select Service
  const renderStepOne = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chọn Dịch Vụ</Text>
      {services.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={[
            styles.serviceCard,
            selectedService?.id === service.id && styles.serviceCardSelected,
          ]}
          onPress={() => setSelectedService(service)}
        >
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDuration}>
              <Ionicons name="time-outline" size={14} color="#666" />
              {' '}{service.duration} phút
            </Text>
          </View>
          <Text style={styles.servicePrice}>{formatCurrency(service.price)}</Text>
          {selectedService?.id === service.id && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Step 2: Select Date & Time
  const renderStepTwo = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chọn Ngày & Giờ</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ngày đặt lịch</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#E91E63" />
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Giờ đặt lịch</Text>
        <View style={styles.timeSlots}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.timeSlotSelected,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.timeSlotTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // Step 3: Select Therapist & Notes
  const renderStepThree = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Thông Tin Bổ Sung</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Chọn chuyên viên (tùy chọn)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTherapist}
            onValueChange={setSelectedTherapist}
            style={styles.picker}
          >
            <Picker.Item label="Để spa sắp xếp" value="" />
            {therapists.map((therapist) => (
              <Picker.Item
                key={therapist.id}
                label={therapist.name}
                value={therapist.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ghi chú (tùy chọn)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Thêm ghi chú cho cuộc hẹn..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Tóm Tắt Đặt Lịch</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Dịch vụ:</Text>
          <Text style={styles.summaryValue}>{selectedService?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ngày:</Text>
          <Text style={styles.summaryValue}>
            {selectedDate.toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Giờ:</Text>
          <Text style={styles.summaryValue}>{selectedTime}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Thời gian:</Text>
          <Text style={styles.summaryValue}>{selectedService?.duration} phút</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(selectedService?.price || 0)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.progressStep}>
            <View
              style={[
                styles.progressCircle,
                currentStep >= step && styles.progressCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.progressNumber,
                  currentStep >= step && styles.progressNumberActive,
                ]}
              >
                {step}
              </Text>
            </View>
            {step < 3 && (
              <View
                style={[
                  styles.progressLine,
                  currentStep > step && styles.progressLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {renderStep()}

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
            
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'VNPay' && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod('VNPay')}
            >
              <View style={styles.paymentOptionLeft}>
                <Ionicons name="card-outline" size={28} color="#0066CC" />
                <View style={styles.paymentOptionText}>
                  <Text style={styles.paymentOptionTitle}>VNPay</Text>
                  <Text style={styles.paymentOptionDesc}>Thanh toán qua cổng VNPay</Text>
                </View>
              </View>
              {paymentMethod === 'VNPay' && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'Cash' && styles.paymentOptionSelected
              ]}
              onPress={() => setPaymentMethod('Cash')}
            >
              <View style={styles.paymentOptionLeft}>
                <Ionicons name="cash-outline" size={28} color="#10B981" />
                <View style={styles.paymentOptionText}>
                  <Text style={styles.paymentOptionTitle}>Tiền mặt</Text>
                  <Text style={styles.paymentOptionDesc}>Thanh toán tại quầy</Text>
                </View>
              </View>
              {paymentMethod === 'Cash' && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleProcessPayment}
              >
                <Text style={styles.modalConfirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Ionicons name="arrow-back" size={20} color="#E91E63" />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 3 ? (
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 1 && !selectedService && styles.buttonDisabled]}
            onPress={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 1 && !selectedService}
          >
            <Text style={styles.nextButtonText}>Tiếp tục</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleBooking}>
            <Text style={styles.nextButtonText}>Xác Nhận Đặt Lịch</Text>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#E91E63',
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  progressNumberActive: {
    color: '#fff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#E91E63',
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    marginRight: 8,
  },
  checkIcon: {
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeSlotSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginLeft: 8,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#E91E63',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentOptionText: {
    gap: 4,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentOptionDesc: {
    fontSize: 12,
    color: '#666',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E91E63',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#E91E63',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
