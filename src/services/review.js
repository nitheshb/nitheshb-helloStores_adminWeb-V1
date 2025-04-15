import request from './request';
import { getAllReviews, getAllReviewsById, deleteReview } from 'firebase.js';

const reviewService = {
  // getAll: (params) =>
  //   request.get('dashboard/admin/reviews/paginate', { params }),
  // getById: (id) => request.get(`dashboard/admin/reviews/${id}`),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/reviews/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/reviews/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/reviews/restore/all`),
  
   // new
    getAll: (params) => getAllReviews('spark', { params }),
    getById: (id, params) => getAllReviewsById('spark', id, { params }),
    delete: (params) => deleteReview(params),
};

export default reviewService;
