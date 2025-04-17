import request from './request';
import { getAlldiscounts, getAlldiscountsSnap, getAlldiscountsById, creatediscountsDb, updatediscounts, deletediscounts } from 'firebase.js';
import { update } from 'lodash';

const discountService = {
  getAll: (params) =>
    request.get('dashboard/admin/discounts/paginate', { params }),
  getById: (id) => request.get(`dashboard/admin/discounts/${id}`),
  create: (data) => request.post('dashboard/admin/discounts', data),
  update: (id, data) => request.put(`dashboard/admin/discounts/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/discounts/delete`, { params }),
  setActive: (id) =>
    request.post(`dashboard/admin/discounts/${id}/active/status`),
  
};

export default discountService;
