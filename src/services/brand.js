import { createBrandDb, getAllBrands ,getAllBrandsSnap,  getAllBrandsById, updateBrand, deleteBrand} from './dbQueries/q_brand';
import request from './request';
import { update } from 'lodash';

const brandService = {
  get: (params) => request.get('dashboard/admin/brands', { params }),
  // getAll: (params) =>
  //   request.get('dashboard/admin/brands/paginate', { params }),
  export: (params) => request.get('dashboard/admin/brands/export', { params }),
  import: (data) => request.post('dashboard/admin/brands/import', data),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/brands/${id}`, { params }),
  // create: (params) => request.post('dashboard/admin/brands', {}, { params }),
  // update: (id, params) =>
  //   request.put(`dashboard/admin/brands/${id}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/brands/delete`, { params }),
  search: (search = '') =>
    request.get(`dashboard/admin/brands/search?search=${search}`),
  dropAll: () => request.get(`dashboard/admin/brands/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/brands/restore/all`),
  // new
  getAll: (params) => getAllBrands('spark', { params }),
  getAllSnap: (params, callback) => getAllBrandsSnap({ params }, callback),
  getById: (id, params) => getAllBrandsById('spark', id, { params }),
  create: (params) => createBrandDb('spark', { params }),
  update: (id, params) => updateBrand( id,params ),
  delete: (params) => deleteBrand(params),
};

export default brandService;
