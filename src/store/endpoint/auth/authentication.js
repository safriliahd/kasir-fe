import API_URL from '../../api/api';


export const login = async (email, password) => {
  try {
    const response = await API_URL.post('/auth/login', {  // Menggunakan instance API
      email,
      password,
    }, { withCredentials: true });  // Menggunakan withCredentials untuk session

    return response.data;  // Mengembalikan respons backend
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};
