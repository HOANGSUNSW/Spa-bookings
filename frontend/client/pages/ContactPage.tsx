import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneIcon, LocationIcon, ClockIcon, ArrowUturnLeftIcon } from '../../shared/icons';

const ContactPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
        e.currentTarget.reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero Section */}
            <div className="relative h-[40vh] bg-brand-dark overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-ocean-gradient opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/img/general/noise.png')] opacity-20 mix-blend-soft-light"></div>
                
                {/* Animated Blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse animation-delay-500"></div>

                <div className="relative z-10 text-center px-4">
                     <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                        Hỗ trợ 24/7
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-white mb-6 drop-shadow-lg animate-slideUpFade">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto font-medium leading-relaxed animate-slideUpFade animation-delay-200">
                        Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn để mang đến trải nghiệm spa tuyệt vời nhất.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute -top-16 left-4 md:left-8 flex items-center text-white/80 hover:text-white font-bold transition-colors group bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20"
                >
                    <ArrowUturnLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    Quay lại
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards - Vertical Stack */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LocationIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Địa chỉ</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">123 Beauty St, Quận Hoàn Kiếm, Hà Nội, Việt Nam</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <PhoneIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Hotline</h3>
                            <p className="text-gray-600 font-medium mb-1">098-765-4321</p>
                            <p className="text-sm text-gray-400">Gọi để đặt lịch hoặc hỗ trợ nhanh</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ClockIcon className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Giờ mở cửa</h3>
                            <p className="text-gray-600 font-medium">Thứ 2 - Chủ nhật: 09:00 - 20:00</p>
                            <p className="text-sm text-gray-400 mt-1">Mở cửa tất cả các ngày trong tuần</p>
                        </div>
                    </div>

                    {/* Info - Main Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 h-full">
                            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Giới thiệu ngắn</h2>
                            <p className="text-gray-600 mb-6">Anh Thơ Spa chuyên cung cấp các dịch vụ chăm sóc sức khỏe và sắc đẹp chuyên nghiệp, kết hợp kỹ thuật hiện đại và sản phẩm cao cấp. Đội ngũ chuyên viên giàu kinh nghiệm cam kết mang lại trải nghiệm thư giãn và kết quả tối ưu cho khách hàng.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="font-bold mb-2">Địa chỉ</h3>
                                    <p>123 Beauty St, Quận Hoàn Kiếm, Hà Nội</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="font-bold mb-2">Giờ mở cửa</h3>
                                    <p>Thứ 2 - Chủ nhật: 09:00 - 20:00</p>
                                </div>

                                <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl">
                                    <h3 className="font-bold mb-2">Liên hệ qua Hotline</h3>
                                    <a href="tel:0987654321" className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition-colors">
                                        <PhoneIcon className="w-5 h-5" /> 098-765-4321
                                    </a>
                                    <p className="text-sm text-gray-500 mt-3">Vui lòng gọi hotline để đặt lịch hoặc cần hỗ trợ nhanh.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;