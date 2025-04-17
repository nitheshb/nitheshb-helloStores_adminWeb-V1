import request from './request';
import { getAllStatistics, getAllStatisticsSnap, getAllStatisticsById, createStatisticsDb, updateStatistics, deleteStatistics } from 'firebase.js';

const statisticService = {
  getAll: (params) => request.get('dashboard/admin/statistics', { params }),
  topCustomers: (params) =>
    request.get(`dashboard/admin/statistics/users`, { params }),
  topProducts: (params) =>
    request.get(`dashboard/admin/statistics/products`, { params }),
  orderSales: (params) =>
    request.get(`dashboard/admin/statistics/sellers/chart`, { params }),
  ordersCount: (params) =>
    request.get(`dashboard/admin/statistics/orders/chart`, { params }),

    // new
    // getAll: (params) => getAllStatistics('spark', { params }),
   
};

export default statisticService;
