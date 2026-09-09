import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentsStackParamList } from './types';
import { PaymentDashboardScreen } from '../screens/payments/PaymentDashboardScreen';
import { CollectPaymentScreen } from '../screens/payments/CollectPaymentScreen';
import { PaymentReceiptScreen } from '../screens/payments/PaymentReceiptScreen';

const Stack = createNativeStackNavigator<PaymentsStackParamList>();

export const PaymentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PaymentDashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="PaymentDashboard" component={PaymentDashboardScreen} />
      <Stack.Screen name="CollectPayment" component={CollectPaymentScreen} />
      <Stack.Screen name="PaymentReceipt" component={PaymentReceiptScreen} />
    </Stack.Navigator>
  );
};
