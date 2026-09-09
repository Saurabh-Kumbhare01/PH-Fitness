import { create } from 'zustand';
import { AttendanceRecord, AttendanceMethod } from '../types';
import { attendanceService } from '../services/attendanceService';
import { MOCK_ATTENDANCE_STATS } from '../mock/attendance';

interface AttendanceState {
  logs: AttendanceRecord[];
  stats: typeof MOCK_ATTENDANCE_STATS & { presentToday: number };
  isLoading: boolean;
  isRecognizing: boolean;
  lastRecognizedMember: AttendanceRecord | null;
  fetchAttendance: () => Promise<void>;
  markAttendance: (
    memberId: string,
    memberName: string,
    memberPhoto?: string,
    method?: AttendanceMethod,
    confidence?: number
  ) => Promise<AttendanceRecord>;
  simulateAiRecognition: (
    memberId: string,
    memberName: string,
    memberPhoto?: string
  ) => Promise<AttendanceRecord>;
  clearLastRecognized: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  logs: [],
  stats: { ...MOCK_ATTENDANCE_STATS, presentToday: 48 },
  isLoading: false,
  isRecognizing: false,
  lastRecognizedMember: null,

  fetchAttendance: async () => {
    set({ isLoading: true });
    try {
      const logs = await attendanceService.getLogs();
      const stats = await attendanceService.getStats();
      set({ logs, stats, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  markAttendance: async (memberId, memberName, memberPhoto, method = 'manual', confidence = 1.0) => {
    const record = await attendanceService.markAttendance(
      memberId,
      memberName,
      memberPhoto,
      method,
      confidence
    );
    const updatedLogs = [record, ...get().logs.filter((l) => l.id !== record.id)];
    set({
      logs: updatedLogs,
      lastRecognizedMember: record,
      stats: {
        ...get().stats,
        presentToday: updatedLogs.length + 42,
      },
    });
    return record;
  },

  simulateAiRecognition: async (memberId, memberName, memberPhoto) => {
    set({ isRecognizing: true });
    // AI face processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const record = await get().markAttendance(memberId, memberName, memberPhoto, 'ai_camera', 0.98);
    set({ isRecognizing: false, lastRecognizedMember: record });
    return record;
  },

  clearLastRecognized: () => set({ lastRecognizedMember: null }),
}));
