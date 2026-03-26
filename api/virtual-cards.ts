import { apiClient } from './client';
import { VirtualCard } from './types';

export const getVirtualCards = (): Promise<{ cards: VirtualCard[] }> => {
  return apiClient('/api/virtual-cards', 'GET');
};

export const createVirtualCard = (data: Partial<VirtualCard>): Promise<VirtualCard> => {
  return apiClient('/api/virtual-cards', 'POST', data);
};

export const updateVirtualCardStatus = (id: string, action: 'pause' | 'resume' | 'delete'): Promise<VirtualCard> => {
  return apiClient(`/api/virtual-cards/${id}`, 'PATCH', { action });
};
