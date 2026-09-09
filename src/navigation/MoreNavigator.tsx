import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreStackParamList } from './types';
import { MoreHubScreen } from '../screens/more/MoreHubScreen';
import { MembershipPlansScreen } from '../screens/membership/MembershipPlansScreen';
import { TrainerListScreen } from '../screens/trainers/TrainerListScreen';
import { AddTrainerScreen } from '../screens/trainers/AddTrainerScreen';
import { TrainerDetailScreen } from '../screens/trainers/TrainerDetailScreen';
import { ReportsDashboardScreen } from '../screens/reports/ReportsDashboardScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { NotificationTemplateScreen } from '../screens/notifications/NotificationTemplateScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MoreHub"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MoreHub" component={MoreHubScreen} />
      <Stack.Screen name="Memberships" component={MembershipPlansScreen} />
      <Stack.Screen name="Trainers" component={TrainerListScreen} />
      <Stack.Screen name="AddTrainer" component={AddTrainerScreen} />
      <Stack.Screen name="TrainerDetail" component={TrainerDetailScreen} />
      <Stack.Screen name="Reports" component={ReportsDashboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationTemplate" component={NotificationTemplateScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
