import request from './request';
import { getAllUsers, getAllusersSnap, getAllUsersById, createUsersDb, updateUsers, deleteUsers } from './dbQueries/q_user';
import { update } from 'lodash';

const userService = {
  // getAll: (params) => request.get('dashboard/admin/users/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/users/${id}`, { params }),
  // create: (data) => request.post('dashboard/admin/users', data),
  // update: (id, data) => request.put(`dashboard/admin/users/${id}`, data),
  // delete: (id) => request.delete(`dashboard/admin/users/${id}`),
  search: (params) => request.get(`dashboard/admin/users/search`, { params }),
  updateRole: (id, params) =>
    request.post(`dashboard/admin/users/${id}/role/update`, {}, { params }),
  updatePassword: (uuid, params) =>
    request.post(`dashboard/admin/users/${uuid}/password`, {}, { params }),
  setActive: (id, params) =>
    request.post(`dashboard/admin/users/${id}/active`, {}, { params }),
  createAddress: (uuid, data) =>
    request.post(`dashboard/admin/users/${uuid}/addresses`, data),
  topupWallet: (uuid, data) =>
    request.post(`dashboard/admin/users/${uuid}/wallets`, data),
  walletHistory: (uuid, params) =>
    request.get(`dashboard/admin/users/${uuid}/wallets/history`, { params }),
  profileShow: (params) =>
    request.get('dashboard/user/profile/show', { params }),
  profileUpdate: (data) => request.put('dashboard/user/profile/update', data),
  getRoles: (params) => request.get('dashboard/admin/roles', { params }),
  dropAll: () => request.get(`dashboard/admin/users/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/users/restore/all`),
  createAndUpdateDeliverymanZone: (data) =>
    request.post('dashboard/admin/delivery-man-delivery-zones', data),
  showDeliverymanZone: (id) =>
    request.get(`dashboard/admin/delivery-man-delivery-zones/${id}`),

  // new
     getAll: (params) => getAllUsers('spark', { params }),
   
      getById: (id, params) => getAllUsersById('spark', id, { params }),
      create: (params) => createUsersDb('spark', { params }),
      update: (id, params) => updateUsers( id, params ),
      delete: (params) => deleteUsers(params),
    
      
};

export default userService;
