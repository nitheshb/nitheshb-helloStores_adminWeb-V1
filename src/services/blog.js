// import request from './request';
// import { createBlogsNotificationsDb , getAllBlogsNotifications,  getAllBlogsNotificationsById, updateBlogsNotifications, deleteBlogsNotifications} from './dbQueries/q_notifications';
// // import { getAllBlogsNotifications } from './dbQueries/q_notifications';
// const blogService = {
//   // getAll: (params) => request.get('dashboard/admin/blogs/paginate', { params }),
//   // getById: (id) => request.get(`dashboard/admin/blogs/${id}`),
//   // create: (data) => request.post('dashboard/admin/blogs', data),
//   // update: (id, data) => request.put(`dashboard/admin/blogs/${id}`, data),
//   // delete: (params) =>
//   //   request.delete(`dashboard/admin/blogs/delete`, { params }),
//   setActive: (id) => request.post(`dashboard/admin/blogs/${id}/active/status`),
//   publish: (id) => request.post(`dashboard/admin/blogs/${id}/publish`),
//   dropAll: () => request.get(`dashboard/admin/blogs/drop/all`),
//   restoreAll: () => request.get(`dashboard/admin/blogs/restore/all`),

//   //new
//   getAll: (params) => getAllBlogsNotifications('spark', { params }),
//         // getAllSnap: (params, callback) => getAllBranchBonusesSnap({ params }, callback),
//         getById: (id, params) => getAllBlogsNotificationsById('spark', id, { params }),
//         create: (params) => createBlogsNotificationsDb('spark', { params }),
//         update: (id, params) => updateBlogsNotifications( id,params ),
//         delete: (params) => deleteBlogsNotifications(params),
// };

// export default blogService;




import request from './request';
import { createBlogsNotificationsDb ,setActiveNotifications, getAllBlogsNotifications,  getAllBlogsNotificationsById, updateBlogsNotifications, deleteBlogsNotifications} from './dbQueries/q_notifications';
// import { getAllBlogsNotifications } from './dbQueries/q_notifications';
const blogService = {
  // getAll: (params) => request.get('dashboard/admin/blogs/paginate', { params }),
  // getById: (id) => request.get(`dashboard/admin/blogs/${id}`),
  // create: (data) => request.post('dashboard/admin/blogs', data),
  // update: (id, data) => request.put(`dashboard/admin/blogs/${id}`, data),
  // delete: (params) =>
  //   request.delete(`dashboard/admin/blogs/delete`, { params }),
  // setActive: (id) => request.post(`dashboard/admin/blogs/${id}/active/status`),
  publish: (id) => request.post(`dashboard/admin/blogs/${id}/publish`),
  dropAll: () => request.get(`dashboard/admin/blogs/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/blogs/restore/all`),
 
  //new
  getAll: (params) => getAllBlogsNotifications('spark', { params }),
        // getAllSnap: (params, callback) => getAllBranchBonusesSnap({ params }, callback),
        getById: (id, params) => getAllBlogsNotificationsById('spark', id, { params }),
        create: (params) => createBlogsNotificationsDb('spark', { params }),
        update: (id, params) => updateBlogsNotifications( id,params ),
        delete: (params) => deleteBlogsNotifications(params),
        setActive: (id) => setActiveNotifications(`dashboard/admin/blogs/active/${id}`),
};
 
export default blogService;
 
 