// API Configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`
  },
  PRODUCTS: {
    LIST: `${API_BASE_URL}/api/products`,
    SELLER: `${API_BASE_URL}/api/products/seller`
  },
  PROFILE: {
    GET: `${API_BASE_URL}/api/profile`
  }
};

export default API_BASE_URL;