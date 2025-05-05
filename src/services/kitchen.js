import { createKitchenDb, getAllKitchens, getKitchenById, updateKitchen, deleteKitchen, setActiveKitchen } from './dbQueries/q_kitchen';

const url = 'dashboard/admin/kitchen';

const kitchenService = {
  // getAll: (params) => request.get(url, { params }),
  // getById: (id, params) => request.get(`${url}/${id}`, { params }),
  // create: (data) => request.post(url, data),
  // update: (id, data) => request.put(`${url}/${id}`, data),
  // delete: (params) => request.delete(`${url}/delete`, { params }),


  getAll: (params) => getAllKitchens('spark', { params }),
   setActive: (id) => setActiveKitchen(`dashboard/admin/units/active/${id}`),
    getById: (id, params) => getKitchenById('spark', id, { params }),
    create: (params) => createKitchenDb('spark', { params }),
    update: (id, params) => updateKitchen( id,params ),
    delete: (params) => deleteKitchen(params),  
};

export default kitchenService;
