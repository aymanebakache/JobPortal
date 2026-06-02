import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const response = await axiosInstance.get('/profile');
  return response.data;
};

export const updateCandidateProfile = async (profileData) => {
  const response = await axiosInstance.put('/profile/candidate', profileData);
  return response.data;
};

export const updateRecruiterProfile = async (profileData) => {
  const response = await axiosInstance.put('/profile/recruiter', profileData);
  return response.data;
};

export const uploadCv = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post('/profile/upload-cv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
