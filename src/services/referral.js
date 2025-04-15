import request from './request';
import { getAllReferral,  updateReferral } from 'firebase.js';

const referralService = {
  // get: (params) => request.get('dashboard/admin/referrals', { params }),
  // update: (params) => request.post(`dashboard/admin/referrals`, {}, { params }),

  //new
  get: (params) => getAllReferral('spark', { params }),
  update: (id, params) => updateReferral( id,params ),
};

export default referralService;
