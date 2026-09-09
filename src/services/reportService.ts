import {
  MOCK_FINANCIAL_REPORTS,
  MOCK_EXPENSE_BREAKDOWN,
  MOCK_MEMBER_DISTRIBUTION,
  MonthlyFinancial,
} from '../mock/reports';

export const reportService = {
  getFinancialReports: async (period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<MonthlyFinancial[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...MOCK_FINANCIAL_REPORTS];
  },

  getExpenseBreakdown: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...MOCK_EXPENSE_BREAKDOWN];
  },

  getMemberDistribution: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...MOCK_MEMBER_DISTRIBUTION];
  },

  exportReport: async (format: 'pdf' | 'excel', period: string): Promise<{ success: boolean; filename: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      filename: `Gym_Performance_Report_${period}_${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`,
    };
  },
};
