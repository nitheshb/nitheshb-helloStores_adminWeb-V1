import request from './request';
import { getAllCoupon, getAllCouponSnap, getAllCouponById, createCouponDb, updateCoupon, deleteCoupon } from 'firebase.js';

const couponService = {
  // getAll: (params) =>
  //   request.get('dashboard/seller/coupons/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/seller/coupons/${id}`, { params }),
  // create: (params) => request.post('dashboard/seller/coupons', {}, { params }),
  // update: (id, params) =>
  //   request.put(`dashboard/seller/coupons/${id}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/seller/coupons/delete`, { params }),
  dropAll: () => request.get(`dashboard/seller/coupons/drop/all`),
  restoreAll: () => request.get(`dashboard/seller/coupons/restore/all`),

  // new
      getAll: (params) => getAllCoupon('spark', { params }),
      // getAllSnap: (params, callback) => getAllCouponSnap({ params }, callback),
      getById: (id, params) => getAllCouponById('spark', id, { params }),
      create: (params) => createCouponDb('spark', { params }),
      update: (id, params) => updateCoupon( id,params ),
      delete: (params) => deleteCoupon(params),
};

export default couponService;
