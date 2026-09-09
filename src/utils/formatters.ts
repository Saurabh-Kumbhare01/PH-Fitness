export const formatCurrency = (amount: number, symbol: string = '₹'): string => {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const calculateBmi = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
};

export const getBmiCategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6' };
  if (bmi < 24.9) return { label: 'Normal Weight', color: '#10B981' };
  if (bmi < 29.9) return { label: 'Overweight', color: '#F59E0B' };
  return { label: 'Obese', color: '#EF4444' };
};

export const getRemainingDays = (endDateStr: string): number => {
  if (!endDateStr) return 0;
  const end = new Date(endDateStr).getTime();
  const now = new Date().getTime();
  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};
