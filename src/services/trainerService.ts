import { Trainer } from '../types';
import { MOCK_TRAINERS } from '../mock/trainers';

let trainersStore = [...MOCK_TRAINERS];

export const trainerService = {
  getTrainers: async (): Promise<Trainer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...trainersStore];
  },

  getTrainerById: async (id: string): Promise<Trainer | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return trainersStore.find((t) => t.id === id) || null;
  },

  addTrainer: async (trainerData: Omit<Trainer, 'id' | 'rating' | 'activeClientsCount'>): Promise<Trainer> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const newTrainer: Trainer = {
      ...trainerData,
      id: `tr-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      activeClientsCount: 0,
    };
    trainersStore = [newTrainer, ...trainersStore];
    return newTrainer;
  },
};
