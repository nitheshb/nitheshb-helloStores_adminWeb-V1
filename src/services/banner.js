import request from './request';
import { getAllBanner, getAllBannerById, createBannerDb, updateBanner, deleteBanner, updateBannerOrder, setActive } from './dbQueries/q_banners';

const bannerService = {
  // getAll: (params) =>
  //   request.get('dashboard/admin/banners/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/banners/${id}`, { params }),
  // create: (data) => request.post('dashboard/admin/banners', data, {}),
  // update: (id, data) => request.put(`dashboard/admin/banners/${id}`, data, {}),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/banners/delete`, { params }),
  // setActive: (id) => request.post(`dashboard/admin/banners/active/${id}`),
  dropAll: () => request.get(`dashboard/admin/banners/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/banners/restore/all`),
  
  // new
    getAll: (params) => getAllBanner('spark', { params }),
    // getAllSnap: (params, callback) => getAllBannerSnap({ params }, callback),
    getById: (id, params) => getAllBannerById('spark', id, { params }),
    create: (params) => createBannerDb('spark', { params }),
    update: (id, params) => updateBanner( id,params ),
    delete: (params) => deleteBanner(params),
    updateOrder: (orderedIds) => updateBannerOrder(orderedIds),
    setActive: (id) => setActive(id),
};

export default bannerService;
