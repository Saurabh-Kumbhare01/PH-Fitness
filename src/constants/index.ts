import { GymSettings, PlanDuration, PaymentMethod, Gender } from '../types';

export const APP_NAME = 'PH-FITNESS';
export const APP_TAGLINE = 'Smart Gym Operating System';
export const APP_VERSION = 'v2.4.0 (Enterprise)';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const PAYMENT_METHODS: { label: string; value: PaymentMethod; icon: string }[] = [
  { label: 'UPI / QR Code', value: 'upi', icon: 'qr-code' },
  { label: 'Cash', value: 'cash', icon: 'cash-outline' },
  { label: 'Credit / Debit Card', value: 'card', icon: 'card-outline' },
  { label: 'Net Banking', value: 'bank_transfer', icon: 'business-outline' },
];

export const PLAN_DURATIONS: { label: string; value: PlanDuration; days: number }[] = [
  { label: 'Daily Pass', value: 'daily', days: 1 },
  { label: 'Weekly', value: 'weekly', days: 7 },
  { label: 'Monthly', value: 'monthly', days: 30 },
  { label: 'Quarterly (3 Mos)', value: 'quarterly', days: 90 },
  { label: 'Half-Yearly (6 Mos)', value: 'half_yearly', days: 180 },
  { label: 'Annual (12 Mos)', value: 'annual', days: 365 },
];

export const DEFAULT_GYM_SETTINGS: GymSettings = {
  gymName: 'PowerHouse Fitness Arena',
  tagline: 'Elite Strength & High Performance Club',
  phone: '+91 98765 43210',
  email: 'support@powerhousegym.com',
  address: 'Plot 42, Cyber Hub Boulevard, Sector 29',
  city: 'Gurugram',
  state: 'Haryana',
  pincode: '122002',
  gstNumber: '07AAAAA0000A1Z5',
  currencySymbol: '₹',
  currencyCode: 'INR',
  taxPercentage: 18,
  openingTime: '05:30 AM',
  closingTime: '10:30 PM',
  darkMode: true,
  securityPinEnabled: true,
  autoBackup: true,
};
