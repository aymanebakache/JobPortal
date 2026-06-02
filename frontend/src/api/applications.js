import axiosInstance from './axiosInstance';

export const applyForJob = async (jobId, coverLetter = '') => {
  const response = await axiosInstance.post('/applications', { jobId, coverLetter });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await axiosInstance.get('/applications/my');
  return response.data;
};

export const getJobApplications = async (jobId) => {
  const response = await axiosInstance.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axiosInstance.put(`/applications/${applicationId}/status`, { status });
  return response.data;
};
