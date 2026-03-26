import axiosInstance from './axios';
import { RoutingRule } from './types';

export const getRoutingRule = async (): Promise<RoutingRule> => {
  return axiosInstance.get('/api/routing');
};

export const updateRoutingRule = async (rule: Partial<RoutingRule>): Promise<RoutingRule> => {
  return axiosInstance.put('/api/routing', rule);
};

export const simulateRouting = async (data: { amount: number; merchant?: string; category?: string }): Promise<any> => {
  return axiosInstance.post('/api/routing/simulate', data);
};
