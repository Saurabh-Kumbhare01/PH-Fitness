export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: undefined;
};

export type MainTabParamList = {
  DashboardTab: undefined;
  MembersTab: undefined;
  AttendanceTab: undefined;
  PaymentsTab: undefined;
  MoreTab: undefined;
};

export type MembersStackParamList = {
  MemberList: { status?: string };
  AddEditMember: { memberId?: string } | undefined;
  MemberDetail: { memberId: string };
};

export type AttendanceStackParamList = {
  AttendanceDashboard: undefined;
  CameraAttendance: undefined;
  AttendanceHistory: undefined;
};

export type PaymentsStackParamList = {
  PaymentDashboard: { filter?: string } | undefined;
  CollectPayment: { memberId?: string } | undefined;
  PaymentReceipt: { transactionId?: string };
};

export type MoreStackParamList = {
  MoreHub: undefined;
  Memberships: undefined;
  Trainers: undefined;
  AddTrainer: undefined;
  TrainerDetail: { trainerId: string };
  Reports: undefined;
  Notifications: undefined;
  NotificationTemplate: undefined;
  Settings: undefined;
};
