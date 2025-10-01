import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    if (!response.status === 200) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/products`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};