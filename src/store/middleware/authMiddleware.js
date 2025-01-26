import axios from 'axios';

export const isLoggedIn = async () => {
  try {
    const response = await axios.get('/auth/session');
    return response.data.isLoggedIn;
  } catch (error) {
    return false;
  }
};

export const isAdmin = async () => {
  try {
    const response = await axios.get('/auth/session');
    return response.data.role === 'ADMIN';
  } catch (error) {
    return false;
  }
};
