import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AttendanceStackParamList } from './types';
import { AttendanceDashboardScreen } from '../screens/attendance/AttendanceDashboardScreen';
import { CameraAttendanceScreen } from '../screens/attendance/CameraAttendanceScreen';
import { AttendanceHistoryScreen } from '../screens/attendance/AttendanceHistoryScreen';

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export const AttendanceNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="AttendanceDashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboardScreen} />
      <Stack.Screen
        name="CameraAttendance"
        component={CameraAttendanceScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
    </Stack.Navigator>
  );
};
