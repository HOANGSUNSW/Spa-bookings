import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Admin Screens
import {
  AdminDashboardScreen,
  AdminUsersScreen,
  AdminServicesScreen,
  AdminServiceFormScreen,
  AdminAppointmentsScreen,
  AdminStaffScreen,
  AdminPromotionsScreen,
  AdminPaymentsScreen,
  AdminProfileScreen
} from '../screens/admin';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#8B5CF6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen name="DashboardMain" component={AdminDashboardScreen} options={{ title: 'Tổng quan' }} />
  </Stack.Navigator>
);

// Users Stack
const UsersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#8B5CF6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen name="UsersList" component={AdminUsersScreen} options={{ title: 'Người dùng' }} />
  </Stack.Navigator>
);

// Services Stack
const ServicesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#8B5CF6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen name="AdminServicesTab" component={AdminServicesScreen} options={{ title: 'Dịch vụ' }} />
    <Stack.Screen 
      name="AdminServiceForm" 
      component={AdminServiceFormScreen} 
      options={{ title: 'Quản lý dịch vụ' }} 
    />
  </Stack.Navigator>
);

// Appointments Stack
const AppointmentsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#8B5CF6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen name="AppointmentsList" component={AdminAppointmentsScreen} options={{ title: 'Lịch hẹn' }} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#8B5CF6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen name="ProfileMain" component={AdminProfileScreen} options={{ title: 'Hồ sơ' }} />
  </Stack.Navigator>
);

export const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e7eb',
          borderTopWidth: 1,
          paddingBottom: 5,
          height: 60
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 4,
          fontWeight: '600'
        }
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UsersStack}
        options={{
          title: 'Người dùng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStack}
        options={{
          title: 'Dịch vụ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsStack}
        options={{
          title: 'Lịch hẹn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
};
