import { getAllDiscounts, getAllDiscountsSnap,setActiveDiscounts, getAllDiscountsById, createDiscountsDb, updateDiscounts, deleteDiscounts } from '../dbQueries/q_discount';


const discountService = {
  //getAll: (params) =>
    //request.get('dashboard/seller/discounts/paginate', { params }),
  // getById: (id) => request.get(`dashboard/seller/discounts/${id}`),
  // create: (data) => request.post('dashboard/seller/discounts', data),
  // update: (id, data) => request.put(`dashboard/seller/discounts/${id}`, data),
  // delete: (params) =>
  //   request.delete(`dashboard/seller/discounts/delete`, { params }),
  // setActive: (id) =>
  //   request.post(`dashboard/seller/discounts/${id}/active/status`),

  // new
    getAll: (params) => getAllDiscounts('spark', { params }),
    setActive: (id) => setActiveDiscounts(`dashboard/seller/discounts/active/${id}`),
    getById: (id, params) => getAllDiscountsById('spark', id, { params }),
    create: (params) => createDiscountsDb('spark', { params }),
    update: (id, params) => updateDiscounts( id,params ),
    delete: (params) => deleteDiscounts(params),
};

export default discountService;
