import API_URL from '../../api/api';


export const login = async (email, password) => {
  try {
    const response = await API_URL.post('/auth/login', {  
      email,
      password,
    }, { withCredentials: true });  

    return response.data;  
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};
