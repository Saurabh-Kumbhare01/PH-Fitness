import { Member } from '../types';
import { MOCK_MEMBERS } from '../mock/members';

let membersStore: Member[] = [...MOCK_MEMBERS];

export const memberService = {
  getMembers: async (query?: string, status?: string): Promise<Member[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let result = [...membersStore];

    if (status && status !== 'all') {
      result = result.filter((m) => m.membershipStatus === status);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.planName.toLowerCase().includes(q)
      );
    }

    return result;
  },

  getMemberById: async (id: string): Promise<Member | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return membersStore.find((m) => m.id === id) || null;
  },

  addMember: async (memberData: Omit<Member, 'id'>): Promise<Member> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newMember: Member = {
      ...memberData,
      id: `mem-${Date.now().toString().slice(-4)}`,
    };
    membersStore = [newMember, ...membersStore];
    return newMember;
  },

  updateMember: async (id: string, updates: Partial<Member>): Promise<Member> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const index = membersStore.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Member not found');
    membersStore[index] = { ...membersStore[index], ...updates };
    return membersStore[index];
  },

  deleteMember: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    membersStore = membersStore.filter((m) => m.id !== id);
    return true;
  },

  suspendMember: async (id: string): Promise<Member> => {
    return memberService.updateMember(id, { membershipStatus: 'suspended' });
  },

  renewMembership: async (
    id: string,
    planId: string,
    planName: string,
    durationDays: number
  ): Promise<Member> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return memberService.updateMember(id, {
      planId,
      planName,
      membershipStatus: 'active',
      membershipStartDate: startDate,
      membershipEndDate: endDate,
    });
  },
};
