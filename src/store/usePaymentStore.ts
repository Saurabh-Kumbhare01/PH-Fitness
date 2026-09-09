import { create } from 'zustand';
import { PaymentTransaction } from '../types';
import { paymentService, CollectPaymentPayload } from '../services/paymentService';
import { MOCK_PAYMENT_METRICS } from '../mock/payments';

interface PaymentState {
  transactions: PaymentTransaction[];
  metrics: typeof MOCK_PAYMENT_METRICS;
  isLoading: boolean;
  selectedReceipt: PaymentTransaction | null;
  fetchPayments: (filterStatus?: string) => Promise<void>;
  collectPayment: (payload: CollectPaymentPayload) => Promise<PaymentTransaction>;
  setSelectedReceipt: (tx: PaymentTransaction | null) => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  transactions: [],
  metrics: MOCK_PAYMENT_METRICS,
  isLoading: false,
  selectedReceipt: null,

  fetchPayments: async (filterStatus) => {
    set({ isLoading: true });
    try {
      const transactions = await paymentService.getPayments(filterStatus);
      const metrics = await paymentService.getMetrics();
      set({ transactions, metrics, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  collectPayment: async (payload) => {
    set({ isLoading: true });
    const newPayment = await paymentService.collectPayment(payload);
    set((state) => ({
      transactions: [newPayment, ...state.transactions],
      selectedReceipt: newPayment,
      metrics: {
        ...state.metrics,
        todayCollection: state.metrics.todayCollection + payload.amount,
        monthlyTotal: state.metrics.monthlyTotal + payload.amount,
      },
      isLoading: false,
    }));
    return newPayment;
  },

  setSelectedReceipt: (tx) => set({ selectedReceipt: tx }),
}));
