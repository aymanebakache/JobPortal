import axiosInstance from './axiosInstance';

export const getJobs = async (params = {}) => {
  const response = await axiosInstance.get('/jobs', { params });
  return response.data;
};

export const getJobById = async (id) => {
  const response = await axiosInstance.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axiosInstance.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await axiosInstance.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axiosInstance.delete(`/jobs/${id}`);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await axiosInstance.get('/jobs/recruiter/my');
  return response.data;
};
