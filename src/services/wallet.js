import request from './request';
import { getAllwallets, getAllwalletsSnap, getAllwalletsById, createwalletsDb, updatedwallets, deletedwallets } from 'firebase.js';
import { update } from 'lodash';

const walletService = {
  getAll: (params) =>
    request.get('dashboard/admin/wallet/histories/paginate', { params }),
  statusChange: (uuid, data) =>
    request.post(`dashboard/admin/wallet/history/${uuid}/status/change`, data),
  // getAll: (params) => getAllwallets('spark', { params }),
   
};

export default walletService;
