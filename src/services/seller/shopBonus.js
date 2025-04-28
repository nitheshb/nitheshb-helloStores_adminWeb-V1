import request from '../request';
import { createBranchBonusesDb, getAllBranchBonuses ,  getAllBranchBonusesById, updateBranchBonuses, deleteBranchBonuses} from 'firebase.js';

const shopBonusService = {
  // getAll: (params) => request.get('dashboard/seller/bonuses', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/seller/bonuses/${id}`, { params }),
  // create: (data) => request.post('dashboard/seller/bonuses', data, {}),
  // update: (id, data) => request.put(`dashboard/seller/bonuses/${id}`, data, {}),
  // delete: (params) =>
  //   request.delete(`dashboard/seller/bonuses/delete`, { params }),
  setActive: (id) => request.post(`dashboard/seller/bonuses/status/${id}`),

    // new
    //Branch Bonus
      getAll: (params) => getAllBranchBonuses('spark', { params }),
      // getAllSnap: (params, callback) => getAllBranchBonusesSnap({ params }, callback),
      getById: (id, params) => getAllBranchBonusesById('spark', id, { params }),
      create: (params) => createBranchBonusesDb('spark', { params }),
      update: (id, params) => updateBranchBonuses( id,params ),
      delete: (params) => deleteBranchBonuses(params),
};

export default shopBonusService;
