import axios from 'axios';

export const login = async (email, password) => {
  const response = await axios.post('/api/user/login', { email, password });
  const { accessToken, refreshToken } = response.data;

  // Store tokens
  localStorage.setItem('refreshToken', refreshToken);
  return accessToken;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post('/api/auth/refresh', {}, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  return response.data.accessToken;
};