export type Gender = 'male' | 'female' | 'other';

export type MembershipStatus = 'active' | 'expiring' | 'expired' | 'suspended';

export type PlanDuration = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'half_yearly' | 'annual';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer';

export type PaymentStatus = 'paid' | 'partial' | 'pending';

export type AttendanceMethod = 'ai_camera' | 'manual' | 'qr_code';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export type NotificationCategory = 'expiry' | 'payment' | 'birthday' | 'promo' | 'general';

export interface Member {
  id: string;
  fullName: string;
  photo?: string;
  phone: string;
  email: string;
  gender: Gender;
  dob: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodGroup: string;
  medicalConditions?: string;
  joinDate: string;
  planId: string;
  planName: string;
  membershipStatus: MembershipStatus;
  membershipStartDate: string;
  membershipEndDate: string;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  notes?: string;
  lastVisit?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  durationType: PlanDuration;
  durationDays: number;
  price: number;
  discountPercentage?: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhoto?: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  confidence?: number;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  memberPhone?: string;
  amount: number;
  originalAmount: number;
  discount: number;
  taxAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  date: string;
  description: string;
  notes?: string;
}

export interface Trainer {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  email: string;
  specialty: string[];
  rating: number;
  experienceYears: number;
  activeClientsCount: number;
  status: 'active' | 'on_leave';
  bio: string;
  monthlySalary?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  createdAt: string;
  read: boolean;
  memberId?: string;
  memberName?: string;
}

export interface GymSettings {
  gymName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  currencySymbol: string;
  currencyCode: string;
  taxPercentage: number;
  openingTime: string;
  closingTime: string;
  darkMode: boolean;
  securityPinEnabled: boolean;
  autoBackup: boolean;
  logoUrl?: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoonMembers: number;
  expiredMembers: number;
  todayAttendance: number;
  todayCollection: number;
  pendingPayments: number;
  monthlyRevenue: number;
  attendanceGrowth: number;
  revenueGrowth: number;
}
