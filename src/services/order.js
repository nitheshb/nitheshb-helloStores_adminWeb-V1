import request from './request';
import { createOrderDb, getAllOrder ,getAllOrderSnap,  getAllOrderById, updateOrder, deleteOrder} from 'firebase.js';

const orderService = {
  getAll: (params) =>
    request.get('dashboard/admin/orders/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/orders/${id}`, { params }),
  export: (params) => request.get(`dashboard/admin/order/export`, { params }),
  // create: (data) => request.post('dashboard/admin/orders', data, {}),
  // update: (id, data) => request.put(`dashboard/admin/orders/${id}`, data),
  calculate: (params) =>
    request.get(`dashboard/admin/order/products/calculate${params}`),
  updateStatus: (id, params) =>
    request.post(`dashboard/admin/order/${id}/status`, {}, { params }),
  updateDelivery: (id, params) =>
    request.post(`dashboard/admin/order/${id}/deliveryman`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/orders/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/orders/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/orders/restore/all`),
  getAllUserOrder: (id, params) =>
    request.get(`dashboard/admin/user-orders/${id}/paginate`, { params }),
  getUserTopProducts: (id, params) =>
    request.get(`dashboard/admin/user-orders/${id}`, { params }),
  updateTransactionStatus: (id, data, params) =>
    request.put(`payments/order/${id}/transactions`, data, { params }),
  updateOrderDetailStatus: (id, data) =>
    request.post(`dashboard/admin/order/details/${id}/status`, data),

   // new
    getAll: (params) => getAllOrder('spark', { params }),
    // getAllSnap: (params, callback) => getAllOrderSnap({ params }, callback),
    getById: (id, params) => getAllOrderById('spark', id, { params }),
    create: (params) => createOrderDb('spark', { params }),
    update: (id, params) => updateOrder( id,params ),
    delete: (params) => deleteOrder(params),
};

export default orderService;
