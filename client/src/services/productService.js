import apiClient from './apiClient';

const productService = {
  getProducts: (searchTerm = '') => {
    return apiClient.get(`/products?search=${searchTerm}`);
  },
  createProduct: (productData) => {
    return apiClient.post('/products', productData);
  },
  deleteProduct: (id) => {
    return apiClient.delete(`/products/${id}`);
  },
  updateProduct: (id, updateData) => {
    return apiClient.put(`/products/${id}`, updateData);
  },
  uploadProductsCSV: (formData) => {
    return apiClient.post('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteMultipleProducts: (productIds) => {
    return apiClient.post('/products/delete-multiple', { productIds });
  },
  exportProducts: () => {
    return apiClient.get('/export/products', { responseType: 'blob' });
  },
};

export default productService;