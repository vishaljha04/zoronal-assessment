import api from '../api/axios';

export const reviewService = {
  // Get reviews for company
  getByCompany: (companyId, params = {}) =>
    api.get(`/reviews/${companyId}`, { params }),

  // Add review
  add: (companyId, reviewData) =>
    api.post(`/reviews/${companyId}`, reviewData),

  // Like a review
  like: (reviewId) => api.patch(`/reviews/like/${reviewId}`),
};
