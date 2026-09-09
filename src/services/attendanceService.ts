import { AttendanceRecord, AttendanceMethod } from '../types';
import { MOCK_ATTENDANCE_LOGS, MOCK_ATTENDANCE_STATS } from '../mock/attendance';

let attendanceStore: AttendanceRecord[] = [...MOCK_ATTENDANCE_LOGS];

export const attendanceService = {
  getLogs: async (date?: string): Promise<AttendanceRecord[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return [...attendanceStore];
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      ...MOCK_ATTENDANCE_STATS,
      presentToday: attendanceStore.length + 42,
    };
  },

  markAttendance: async (
    memberId: string,
    memberName: string,
    memberPhoto?: string,
    method: AttendanceMethod = 'ai_camera',
    confidence: number = 0.98
  ): Promise<AttendanceRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    // Check if already checked in today
    const existing = attendanceStore.find((a) => a.memberId === memberId && a.date === dateStr);
    if (existing) {
      // Mark check out
      existing.checkOutTime = timeStr;
      return existing;
    }

    const record: AttendanceRecord = {
      id: `att-${Date.now().toString().slice(-5)}`,
      memberId,
      memberName,
      memberPhoto,
      date: dateStr,
      checkInTime: timeStr,
      status: 'present',
      method,
      confidence,
    };

    attendanceStore = [record, ...attendanceStore];
    return record;
  },
};
