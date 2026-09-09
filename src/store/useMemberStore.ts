import { create } from 'zustand';
import { Member, MembershipStatus } from '../types';
import { memberService } from '../services/memberService';

interface MemberState {
  members: Member[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  sortBy: 'name' | 'joinDate' | 'expiry';
  fetchMembers: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sort: 'name' | 'joinDate' | 'expiry') => void;
  addMember: (data: Omit<Member, 'id'>) => Promise<Member>;
  updateMember: (id: string, data: Partial<Member>) => Promise<Member>;
  deleteMember: (id: string) => Promise<boolean>;
  suspendMember: (id: string) => Promise<Member>;
  renewMember: (id: string, planId: string, planName: string, durationDays: number) => Promise<Member>;
  filteredMembers: () => Member[];
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  isLoading: false,
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'name',

  fetchMembers: async () => {
    set({ isLoading: true });
    try {
      const data = await memberService.getMembers();
      set({ members: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSortBy: (sortBy) => set({ sortBy }),

  addMember: async (data) => {
    set({ isLoading: true });
    const newMember = await memberService.addMember(data);
    set((state) => ({
      members: [newMember, ...state.members],
      isLoading: false,
    }));
    return newMember;
  },

  updateMember: async (id, data) => {
    set({ isLoading: true });
    const updated = await memberService.updateMember(id, data);
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? updated : m)),
      isLoading: false,
    }));
    return updated;
  },

  deleteMember: async (id) => {
    set({ isLoading: true });
    await memberService.deleteMember(id);
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
      isLoading: false,
    }));
    return true;
  },

  suspendMember: async (id) => {
    const updated = await memberService.suspendMember(id);
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? updated : m)),
    }));
    return updated;
  },

  renewMember: async (id, planId, planName, durationDays) => {
    const updated = await memberService.renewMembership(id, planId, planName, durationDays);
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? updated : m)),
    }));
    return updated;
  },

  filteredMembers: () => {
    const { members, searchQuery, statusFilter, sortBy } = get();
    let result = [...members];

    if (statusFilter !== 'all') {
      result = result.filter((m) => m.membershipStatus === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.planName.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === 'joinDate') {
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      }
      if (sortBy === 'expiry') {
        return new Date(a.membershipEndDate).getTime() - new Date(b.membershipEndDate).getTime();
      }
      return 0;
    });

    return result;
  },
}));
