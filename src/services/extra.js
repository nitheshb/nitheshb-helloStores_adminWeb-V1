import request from './request';
import { getAllValues, getAllValuesSnap, getAllValuesById, createValuesDb, updateValues, deleteValues } from './dbQueries/q_extra_values';
import { getAllGroups, getAllGroupsSnap, getAllGroupsById, createGroupsDb, updateGroups, deleteGroups } from './dbQueries/q_extra_groups';
import { update } from 'lodash';

const extraService = {
  // getAllGroups: (params) =>
  //   request.get('dashboard/admin/extra/groups', { params }),
  // getGroupById: (id, params) =>
  //   request.get(`dashboard/admin/extra/groups/${id}`, { params }),
  getGroupTypes: (params) =>
    request.get('dashboard/admin/extra/groups/types', { params }),
  // createGroup: (data) => request.post('dashboard/admin/extra/groups', data),
  // updateGroup: (id, data) =>
  //   request.put(`dashboard/admin/extra/groups/${id}`, data),
  // deleteGroup: (params) =>
  //   request.delete(`dashboard/admin/extra/groups/delete`, { params }),
  dropAllGroup: () => request.get(`dashboard/admin/extra/group/drop/all`),
  restoreAllGroup: () => request.get(`dashboard/admin/extra/group/restore/all`),

  // getAllValues: (params) =>
  //   request.get('dashboard/admin/extra/values', { params }),
  // getValueById: (id, params) =>
  //   request.get(`dashboard/admin/extra/values/${id}`, { params }),
  // createValue: (params) =>
  //   request.post('dashboard/admin/extra/values', {}, { params }),
  // updateValue: (id, params) =>
  //   request.put(`dashboard/admin/extra/values/${id}`, {}, { params }),
  // deleteValue: (params) =>
  //   request.delete(`dashboard/admin/extra/values/delete`, { params }),
  dropAllValue: () => request.get(`dashboard/admin/extra/values/drop/all`),
  restoreAllValue: () =>
    request.get(`dashboard/admin/extra/values/restore/all`),
  
  // new
   getAllValues: (params) => getAllValues('spark', { params }),
   
  getValueById: (id, params) => getAllValuesById('spark', id, { params }),
    createValue: (params) => createValuesDb('spark', { params }),
    updateValue: (id, params) => updateValues( id,params ),
    deleteValue: (params) => deleteValues(params),

    getAllGroups: (params) => getAllGroups('spark', { params }),
   
    getGroupById: (id, params) => getAllGroupsById('spark', id, { params }),
    createGroup: (params) => createGroupsDb('spark', { params }),
    updateGroup: (id, params) => updateGroups( id,params ),
    deleteGroup: (params) => deleteGroups(params),
};

export default extraService;
