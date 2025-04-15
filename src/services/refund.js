import request from './request';
import { getAllRefund,  getAllRefundById, createRefundDb, updateRefund, deleteRefund } from 'firebase.js';

const refundService = {
  // getAll: (params) =>
  //   request.get('dashboard/admin/order-refunds/paginate', { params }),
  getList: (params) => request.get('dashboard/user/order-refunds', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/order-refunds/${id}`, { params }),
  // update: (id, params) =>
  //   request.put(`dashboard/admin/order-refunds/${id}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/order-refunds/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/order-refunds/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/order-refunds/restore/all`),

  // new
    getAll: (params) => getAllRefund('spark', { params }),
    getById: (id, params) => getAllRefundById('spark', id, { params }),
    create: (params) => createRefundDb('spark', { params }),
    update: (id, params) => updateRefund( id,params ),
    delete: (params) => deleteRefund(params),
};

export default refundService;
