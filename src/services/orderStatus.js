import request from './request';
import { getAllOrderStatus, getAllOrderStatusById } from 'firebase.js';

const OrderStatusService = {
  // getAll: (params) => request.get('dashboard/admin/order-statuses', { params }),
  // get: (params) => request.get('rest/order-statuses', { params }),
  status: (id) => request.post(`dashboard/admin/order-statuses/${id}/active`),

  //new
  getAll: (params) => getAllOrderStatus('spark', { params }),
  get: (params) => getAllOrderStatusById('spark', { params }),
  // status: (params) => getAllOrderStatus('spark', { params }),

  
};

export default OrderStatusService;
