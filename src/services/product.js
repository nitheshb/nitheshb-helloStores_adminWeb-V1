import request from './request';
import{getAllProducts, ExtrasGroupsDb, getAllproductsSnap, getAllProductsById, createProductsDb, updateProducts, deleteProducts, createStocksDb} from './dbQueries/q_product';
import { update } from 'lodash';
             
const productService = {
  //  getAll: (params) =>
  //   request.get('dashboard/admin/products/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/products/${id}`, { params }),
  export: (params) =>
    request.get(`dashboard/admin/products/export`, { params }),
  import: (data) => request.post('dashboard/admin/products/import', data),
  // create: (params) => request.post(`dashboard/admin/products`, {}, { params }),
  // update: (uuid, params) =>
  //   request.put(`dashboard/admin/products/${uuid}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/products/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/products/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/products/restore/all`),
  // extras: (uuid, data) =>
  //   request.post(`dashboard/admin/products/${uuid}/extras`, data),
  // stocks: (uuid, data) =>
  //   request.post(`dashboard/admin/products/${uuid}/stocks`, data),
  properties: (uuid, data) =>
    request.post(`dashboard/admin/products/${uuid}/properties`, data),
  setActive: (uuid) =>
    request.post(`dashboard/admin/products/${uuid}/active`, {}),
  getStock: (params) =>
    request.get(`dashboard/admin/stocks/select-paginate`, { params }),
  // updateStatus: (uuid, params) =>
  //   request.post(
  //     `dashboard/admin/products/${uuid}/status/change`,
  //     {},
  //     { params },
  //   ),
  sync: (data) =>
    request.post(`dashboard/admin/products/parent/sync`, data, {}),
 
 
 
    getAll: (params) => getAllProducts('spark', { params }),
    getById: (id, params) => getAllProductsById('spark', id, { params }),
    create: (params) => createProductsDb('spark', { params }),
    update: (id, params) => updateProducts( id,params ),
    delete: (params) => deleteProducts(params),
    stocks: (uuid, data) => createStocksDb(uuid, data),
    extras: (id, params) => ExtrasGroupsDb(`dashboard/admin/products/${id}/extras`, params),
    updateStatus: (id, params) => ExtrasGroupsDb( `dashboard/admin/products/${id}/status/change`,
      {},
      { params },),

   
   
};
 
export default productService;