import axiosInstance from './axiosInstance';

export const getAdminUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};
