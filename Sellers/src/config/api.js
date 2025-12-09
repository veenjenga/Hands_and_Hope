// API Configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://handsandhope.onrender.com';

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
  },
  SELLERS: {
    DEACTIVATE: `${API_BASE_URL}/api/sellers/deactivate`,
    DELETE: `${API_BASE_URL}/api/sellers/delete`
  }
};

export default API_BASE_URL;