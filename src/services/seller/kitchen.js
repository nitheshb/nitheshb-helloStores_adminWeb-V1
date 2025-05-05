// import request from '../request';
import { createKitchenDb, getAllKitchens, getKitchenById, updateKitchen, deleteKitchen, setActiveKitchen } from '../dbQueries/q_kitchen';

// const url = 'dashboard/seller/kitchen';

const kitchenService = {
    getAll: (params) => getAllKitchens('spark', { params }),
     setActive: (id) => setActiveKitchen(`dashboard/seller/kitchen/active/${id}`),
      getById: (id, params) => getKitchenById('spark', id, { params }),
      create: (params) => createKitchenDb('spark', { params }),
      update: (id, params) => updateKitchen( id,params ),
      delete: (params) => deleteKitchen(params),
};

export default kitchenService;
