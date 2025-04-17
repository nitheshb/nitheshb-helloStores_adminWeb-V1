import request from './request';
import { getAllDeliverymans, getAllDeliverymansSnap, getAllDeliverymansById, createDeliverymansDb, updateDeliverymans, deleteDeliverymans } from 'firebase.js';
import { update } from 'lodash';

const deliveryService = {
  get: (params) => request.get('dashboard/admin/users/paginate', { params }),
  getAll: (params) =>
    request.get('dashboard/admin/deliverymans/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/deliveryman-settings/${id}`, { params }),
  // create: (data) =>
  //   request.post('dashboard/admin/deliveryman-settings', data, {}),
  // update: (id, data) =>
  //   request.put(`dashboard/admin/deliveryman-settings/${id}`, data, {}),
  // getTypes: (params) =>
  //   request.get(`dashboard/admin/delivery/types`, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/users/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/deliverymans/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/deliverymans/restore/all`),

  // new
  // getAll: (params) => getAllDeliverymans('spark', { params }),
      getAllSnap: (params, callback) => getAllDeliverymans({ params }, callback),
      getById: (id, params) => getAllDeliverymansById('spark', id, { params }),
      create: (params) => createDeliverymansDb('spark', { params }),
      update: (id, params) => updateDeliverymans( id,params ),
      delete: (params) => deleteDeliverymans(params),
};

export default deliveryService;
