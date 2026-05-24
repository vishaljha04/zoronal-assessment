import api from '../api/axios';

export const companyService = {
  // Get companies with filters
  getAll: (params = {}) => api.get('/companies', { params }),

  // Get single company
  getById: (id) => api.get(`/companies/${id}`),

  // Create company
  create: (companyData) => api.post('/companies', companyData),
};
