import { getAllCategories, getAllCategoriesById ,createCategoriesDb,  updateCategory, deleteCategory} from './dbQueries/q_categories';

import request from './request';

const categoryService = {
  // getAll: (params) =>
  //   request.get('dashboard/admin/categories/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/categories/${id}`, { params }),
  // create: (params) =>
  //   request.post('dashboard/admin/categories', {}, { params }),
  // update: (id, params) =>
  //   request.put(`dashboard/admin/categories/${id}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/categories/delete`, { params }),
  search: (params) =>
    request.get('dashboard/admin/categories/search', { params }),
  setActive: (id) => request.post(`dashboard/admin/categories/${id}/active`),
  dropAll: () => request.get(`dashboard/admin/categories/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/categories/restore/all`),
  export: (params) =>
    request.get('dashboard/admin/categories/export', { params }),
  import: (data) => request.post('dashboard/admin/categories/import', data),
  updateStatus: (id, params) =>
    request.post(
      `dashboard/admin/categories/${id}/status/change`,
      {},
      { params },
    ),

    // new

      getAll: (params) => getAllCategories('spark', { params }),
      getById: (id, params) => getAllCategoriesById('spark', id, { params }),
      create: (params) => createCategoriesDb('spark', { params }),
      update: (id, params) => updateCategory( id,params ),
      delete: (params) => deleteCategory(params),
};

export default categoryService;
