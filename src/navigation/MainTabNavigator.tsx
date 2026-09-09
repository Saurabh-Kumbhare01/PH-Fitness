import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { MembersNavigator } from './MembersNavigator';
import { AttendanceNavigator } from './AttendanceNavigator';
import { PaymentsNavigator } from './PaymentsNavigator';
import { MoreNavigator } from './MoreNavigator';
import { useThemeStore } from '../store/useThemeStore';
import { typography } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { colors } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MembersTab"
        component={MembersNavigator}
        options={{
          tabBarLabel: 'Members',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AttendanceTab"
        component={AttendanceNavigator}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'scan-circle' : 'scan-circle-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsNavigator}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MoreTab"
        component={MoreNavigator}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
