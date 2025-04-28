import request from '../request';
import { createProductBonusesDb, getAllProductBonuses ,  getAllProductBonusesById, updateProductBonuses, deleteProductBonuses} from 'firebase.js';


const bonusService = {
  // getAll: (params) => request.get('dashboard/seller/bonuses', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/seller/bonuses/${id}`, { params }),
  // create: (data) => request.post('dashboard/seller/bonuses', data, {}),
  // update: (id, data) => request.put(`dashboard/seller/bonuses/${id}`, data, {}),
  // delete: (params) =>
  //   request.delete(`dashboard/seller/bonuses/delete`, { params }),
  setActive: (id) => request.post(`dashboard/seller/bonuses/status/${id}`),

  // new
  //Product Bonus
    getAll: (params) => getAllProductBonuses('spark', { params }),
    // getAllSnap: (params, callback) => getAllProductBonusesSnap({ params }, callback),
    getById: (id, params) => getAllProductBonusesById('spark', id, { params }),
    create: (params) => createProductBonusesDb('spark', { params }),
    update: (id, params) => updateProductBonuses( id,params ),
    delete: (params) => deleteProductBonuses(params),
};

export default bonusService;
