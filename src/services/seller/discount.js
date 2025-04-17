import request from '../request';
import { getAllDiscounts, getAllDiscountsSnap, getAllDiscountsById, createDiscountsDb, updateDiscounts, deleteDiscounts } from 'firebase.js';
import { update } from 'lodash';

const discountService = {
  // getAll: (params) =>
  //   request.get('dashboard/seller/discounts/paginate', { params }),
  // getById: (id) => request.get(`dashboard/seller/discounts/${id}`),
  // create: (data) => request.post('dashboard/seller/discounts', data),
  // update: (id, data) => request.put(`dashboard/seller/discounts/${id}`, data),
  // delete: (params) =>
  //   request.delete(`dashboard/seller/discounts/delete`, { params }),
  setActive: (id) =>
    request.post(`dashboard/seller/discounts/${id}/active/status`),

  // new
    getAll: (params) => getAllDiscounts('spark', { params }),
   
    getById: (id, params) => getAllDiscountsById('spark', id, { params }),
    create: (params) => createDiscountsDb('spark', { params }),
    update: (id, params) => updateDiscounts( id,params ),
    delete: (params) => deleteDiscounts(params),
};

export default discountService;
