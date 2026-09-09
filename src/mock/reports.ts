export interface MonthlyFinancial {
  month: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  newMembers: number;
  renewals: number;
}

export const MOCK_FINANCIAL_REPORTS: MonthlyFinancial[] = [
  { month: 'Apr', revenue: 285000, expenses: 140000, netProfit: 145000, newMembers: 22, renewals: 18 },
  { month: 'May', revenue: 310000, expenses: 145000, netProfit: 165000, newMembers: 26, renewals: 20 },
  { month: 'Jun', revenue: 295000, expenses: 142000, netProfit: 153000, newMembers: 19, renewals: 24 },
  { month: 'Jul', revenue: 350000, expenses: 158000, netProfit: 192000, newMembers: 31, renewals: 29 },
  { month: 'Aug', revenue: 385000, expenses: 162000, netProfit: 223000, newMembers: 35, renewals: 32 },
  { month: 'Sep', revenue: 342800, expenses: 150000, netProfit: 192800, newMembers: 28, renewals: 26 },
];

export const MOCK_EXPENSE_BREAKDOWN = [
  { category: 'Trainer & Staff Salaries', amount: 85000, percentage: 56 },
  { category: 'Facility Rent & Maintenance', amount: 42000, percentage: 28 },
  { category: 'Electricity & Utilities', amount: 15000, percentage: 10 },
  { category: 'Marketing & Promos', amount: 8000, percentage: 6 },
];

export const MOCK_MEMBER_DISTRIBUTION = [
  { label: 'Active', count: 96, percentage: 71, color: '#10B981' },
  { label: 'Expiring Soon', count: 14, percentage: 10, color: '#F59E0B' },
  { label: 'Expired', count: 18, percentage: 13, color: '#EF4444' },
  { label: 'Suspended', count: 8, percentage: 6, color: '#64748B' },
];
