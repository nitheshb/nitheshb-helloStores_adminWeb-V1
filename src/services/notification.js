import request from './request';
import { getAllNotifications } from 'firebase.js';

const notificationService = {
  getStatistics: () =>
    request.get('dashboard/user/profile/notifications-statistic'),
  // getAll: (params = {}) =>
  //   request.get('dashboard/notifications', {
  
  //     params,
  //   }),

  readAll: () => request.post('dashboard/notifications/read-all'),
  readAt: (id) => request.post(`dashboard/notifications/${id}/read-at`),

  //new
   getAll: (params) => getAllNotifications('spark', { params }),
};



export default notificationService;
