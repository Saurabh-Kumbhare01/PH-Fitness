import { MembershipPlan } from '../types';
import { MOCK_PLANS } from '../mock/memberships';

let plansStore = [...MOCK_PLANS];

export const membershipService = {
  getPlans: async (): Promise<MembershipPlan[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...plansStore];
  },

  getPlanById: async (id: string): Promise<MembershipPlan | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return plansStore.find((p) => p.id === id) || null;
  },

  createPlan: async (plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newPlan: MembershipPlan = {
      ...plan,
      id: `plan-${Date.now().toString().slice(-4)}`,
    };
    plansStore.push(newPlan);
    return newPlan;
  },
};
