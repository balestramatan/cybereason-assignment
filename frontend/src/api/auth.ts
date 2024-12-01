import { API_BASE } from '../config';

import axiosInstance from './axiosInstance';

export const registerUser = async (email: string, password: string, repeatPassword: string) => {
  const response = await axiosInstance.post(`${API_BASE}/auth/register`, { email, password, repeatPassword });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post(`${API_BASE}/auth/login`, { email, password });
  return response.data;
};