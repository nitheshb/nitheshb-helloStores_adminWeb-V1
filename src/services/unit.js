import request from './request';
import { getAllUnits, getAllUnitsById, createUnitsDb, updateUnits, deleteUnits, setActiveUnits } from './dbQueries/q_unit';


const unitService = {
  // getAll: (params) => request.get('dashboard/admin/units/paginate', { params }),
  // getById: (id, params) =>
  //   request.get(`dashboard/admin/units/${id}`, { params }),
  // create: (params) => request.post('dashboard/admin/units', {}, { params }),
  // update: (id, params) =>
  //   request.put(`dashboard/admin/units/${id}`, {}, { params }),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/units/delete`, { params }),
  // setActive: (id) => request.post(`dashboard/admin/units/active/${id}`),
  dropAll: () => request.get(`dashboard/admin/units/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/units/restore/all`),
  // new
 getAll: (params) => getAllUnits('spark', { params }),
 setActive: (id) => setActiveUnits(`dashboard/admin/units/active/${id}`),
  getById: (id, params) => getAllUnitsById('spark', id, { params }),
  create: (params) => createUnitsDb('spark', { params }),
  update: (id, params) => updateUnits( id,params ),
  delete: (params) => deleteUnits(params),  
};



export default unitService;












