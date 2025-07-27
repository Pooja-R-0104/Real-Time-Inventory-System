import apiClient from './apiClient'; // <-- Import our configured apiClient

const API_URL = '/users/'; // We only need the path now

const register = (name, email, password) => {
  // Use apiClient instead of axios
  return apiClient.post(API_URL + 'register', {
    name,
    email,
    password,
  });
};

const login = async (email, password) => {
  // Use apiClient instead of axios
  const response = await apiClient.post(API_URL + 'login', {
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;