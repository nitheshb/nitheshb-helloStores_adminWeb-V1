import request from './request';
import{getAllProducts, getAllproductsSnap, getAllProductsById, createProductDb, updateProducts, deleteProducts} from 'firebase.js';
import { update } from 'lodash';
              
const productService = {
  getAll: (params) =>
    request.get('dashboard/admin/products/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/products/${id}`, { params }),
  export: (params) =>
    request.get(`dashboard/admin/products/export`, { params }),
  import: (data) => request.post('dashboard/admin/products/import', data),
  create: (params) => request.post(`dashboard/admin/products`, {}, { params }),
  // update: (uuid, params) =>
  //   request.put(`dashboard/admin/products/${uuid}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/products/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/products/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/products/restore/all`),
  extras: (uuid, data) =>
    request.post(`dashboard/admin/products/${uuid}/extras`, data),
  stocks: (uuid, data) =>
    request.post(`dashboard/admin/products/${uuid}/stocks`, data),
  properties: (uuid, data) =>
    request.post(`dashboard/admin/products/${uuid}/properties`, data),
  setActive: (uuid) =>
    request.post(`dashboard/admin/products/${uuid}/active`, {}),
  getStock: (params) =>
    request.get(`dashboard/admin/stocks/select-paginate`, { params }),
  updateStatus: (uuid, params) =>
    request.post(
      `dashboard/admin/products/${uuid}/status/change`,
      {},
      { params },
    ),
  sync: (data) =>
    request.post(`dashboard/admin/products/parent/sync`, data, {}),

  //  getAll: (params) => getAllproducts('spark', { params }),
    getAllSnap: (params, callback) => getAllProducts({ params }, callback),
    getById: (id, params) => getAllProductsById('spark', id, { params }),
    // create: (params) => createProductDb('spark', { params }),
    update: (id, params) => updateProducts( id,params ),
    delete: (params) => deleteProducts(params),
};

export default productService;
