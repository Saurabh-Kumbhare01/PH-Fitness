import { PaymentTransaction, PaymentMethod, PaymentStatus } from '../types';
import { MOCK_PAYMENTS, MOCK_PAYMENT_METRICS } from '../mock/payments';

let paymentsStore = [...MOCK_PAYMENTS];

export interface CollectPaymentPayload {
  memberId: string;
  memberName: string;
  memberPhone?: string;
  amount: number;
  originalAmount: number;
  discount: number;
  taxAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  description: string;
  notes?: string;
}

export const paymentService = {
  getPayments: async (filterStatus?: string): Promise<PaymentTransaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (filterStatus && filterStatus !== 'all') {
      return paymentsStore.filter((p) => p.paymentStatus === filterStatus);
    }
    return [...paymentsStore];
  },

  getMetrics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_PAYMENT_METRICS;
  },

  getPaymentById: async (id: string): Promise<PaymentTransaction | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return paymentsStore.find((p) => p.id === id) || null;
  },

  collectPayment: async (payload: CollectPaymentPayload): Promise<PaymentTransaction> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newPayment: PaymentTransaction = {
      ...payload,
      id: `pay-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: dateStr,
    };

    paymentsStore = [newPayment, ...paymentsStore];
    return newPayment;
  },
};
