// import { db,doc,collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
// // step 1: change all collection(tables) names in 6 queries 

// export const  createUsersDb = async (orgId, payload)  =>  {
//     // step 2a: check what values are required by going to network call of http://admin.hellostores.com     
//     // step 2b: check what values are coming from parms through console.log
//     try {
//       const filesCollectionRef = collection(db, `T_users`); // step 1: change to your collection name
//       const { params } = payload;
//       console.log('my user params in duplicate are ====>', params)
//       const docRef = await addDoc(filesCollectionRef, {...params});
//       console.log('✅ Files saved successfully with ID:', docRef.id);
//       return docRef.id;
//     } catch (error) {
//       console.error('Error saving files to Firestore:', error);
//       throw error;
//     }
//   };





// export const getAllusers = async (orgId, params) => {
//   console.log('params are ====>', params)
//   // const {params} = params
//   let convertStatus =params?.params?.status ==='published' ? 1: 0
//   const filesQuery = query(
//     collection(db, `T_users`) // change to your collection name
//    // where('active', '==', convertStatus),
//   );
//   const querySnapshot = await getDocs(filesQuery);
//   const files = querySnapshot.docs.map((doc) => {
//     let x = doc.data();
//     x.id = doc.id; 
//     x.uuid = doc.id;
//     return x;
//   });
  
  
// let y  = {data:files, 
//    "meta": {
//   "current_page": 1,
//   "from": 1,
//   "last_page": 1,
//   "links": [
//       {
//           "url": null,
//           "label": "&laquo; Previous",
//           "active": false
//       },
//       {
//           "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_users\/paginate?page=1",
//           "label": "1",
//           "active": true
//       },
//       {
//           "url": null,
//           "label": "Next &raquo;",
//           "active": false
//       }
//   ],
//   "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_users\/paginate",
//   "per_page": "1000",
//   "to": files.length,
//   "total": files.length
// }}
//   return y;
// };

// export const getAllusersSnap = async (params, callback) => {
//   console.log('snap are ====>', params)
//     try {
//     const filesQuery1 = query(
//       collection(db, `T_users`), //step 1:  change to your collection name
//       where("status", "==", params?.params?.status || "published")
//     );
//     const itemsQuery1 = query(
//       collection(db, 'T_users'),

//     )
//     // return await onSnapshot(itemsQuery1, callback)
  
//     // Subscribe to real-time updates
//     const unsubscribe = onSnapshot(filesQuery1, (querySnapshot) => {
//       const files = querySnapshot.docs.map((doc) => {
//         let x = doc.data();
//         x.id = doc.id;
//         x.uuid = doc.id;
//         return x;
//       });
  
//       let response = {
//         data: files,
//         meta: {
//           current_page: 1,
//           from: 1,
//           last_page: 1,
//           links: [
//             { url: null, label: "&laquo; Previous", active: false },
//             {
//               url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_users/paginate?page=1",
//               label: "1",
//               active: true,
//             },
//             { url: null, label: "Next &raquo;", active: false },
//           ],
//           path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_users/paginate",
//           per_page: "10",
//           to: files.length,
//           total: files.length,
//         },
//       };
  
//       // Call the provided callback function with updated data
//       console.log('my response is', response)
//       callback(response);
//     });
  
//     // Return the unsubscribe function to stop listening when needed
//     return unsubscribe;
  
//   } catch (error) {
//       console.error('Error fetching T_users:', error);
//   }
//   return     
//   // const {params} = params

// };
// export const getAllUsersById = async (orgId, uid, payload) => {
//   try {
//     const docRef = doc(db, `T_users`, uid) // step 1: change to your collection name
//     const docSnap = await getDoc(docRef)

//     console.log('Document data:', docSnap.data());

//     if (docSnap.exists() && docSnap.data()) {
//       console.log('Brokerage details found:', docSnap.data());
//       let x =docSnap.data();
//       x.id = docSnap.id;
//       x.uuid = doc.id;
//       x.img = x['images[0]'];

//       return docSnap.data();
//     } else {
//       console.log('No brokerage details found.');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching brokerage details:', error);
//     throw error;
//   }
// };

// export const deleteUsers= async (params) => {
//   console.log('delte T_users is ', params)
//   params.map(async(item) => {
//    await deleteDoc(doc(db, 'T_users', item)) // step 1: change to your collection name
//   })

// }

import { db, doc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';

// Create a new User
export const createUsersDb = async (orgId, payload) => {
  try {
    const usersCollectionRef = collection(db, `T_users`);
    const { params } = payload;
    console.log('User params ====>', params);

    const docRef = await addDoc(usersCollectionRef, { ...params });
    console.log('✅ User saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

export const updateUsers = async (uid, params) => {
  try {
    console.log('params are ====>', uid, params);

    const updateData = {};
    if (params.firstname !== undefined) updateData.firstname = params.firstname;
    if (params.lastname !== undefined) updateData.lastname = params.lastname;
    if (params.email !== undefined) updateData.email = params.email;
    if (params.phone !== undefined) updateData.phone = params.phone;
    if (params.active !== undefined) updateData.active = params.active;
    if (params.birthday !== undefined) updateData.birthday = params.birthday;
    if (params.gender !== undefined) updateData.gender = params.gender;
    if (params['images[0]'] !== undefined) updateData['images[0]'] = params['images[0]'];

    await updateDoc(doc(db, `T_users`, uid), updateData);

    console.log('✅ User updated successfully');
  } catch (error) {
    console.log('❌ Failed updating T_users', error, {
      ...params,
    });
  }
};

//  Get all Users
export const getAllUsers = async (orgId, params) => {
  console.log('Get all T_users params ====>', params);

  let convertStatus = params?.params?.status === 'published' ? 1 : 0;
  const usersQuery = query(
    collection(db, `T_users`),
    // where('active', '==', convertStatus),
  );

  const querySnapshot = await getDocs(usersQuery);
  const T_users = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id;
    x.uuid = doc.id;
    return x;
  });

  let response = {
    data: T_users,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [
        { url: null, label: "&laquo; Previous", active: false },
        { url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_users/paginate?page=1", label: "1", active: true },
        { url: null, label: "Next &raquo;", active: false },
      ],
      path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_users/paginate",
      per_page: "1000",
      to: T_users.length,
      total: T_users.length,
    },
  };

  return response;
};

// Get all Users with real-time snapshot
export const getAllUsersSnap = async (params, callback) => {
  console.log('Snapshot T_users params ====>', params);
  try {
    const usersQuery = query(
      collection(db, `T_users`),
      where("status", "==", params?.params?.status || "published")
    );

    const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
      const T_users = querySnapshot.docs.map((doc) => {
        let x = doc.data();
        x.id = doc.id;
        x.uuid = doc.id;
        return x;
      });

      let response = {
        data: T_users,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [
            { url: null, label: "&laquo; Previous", active: false },
            { url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_users/paginate?page=1", label: "1", active: true },
            { url: null, label: "Next &raquo;", active: false },
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_users/paginate",
          per_page: "10",
          to: T_users.length,
          total: T_users.length,
        },
      };

      console.log('Snapshot response:', response);
      callback(response);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error fetching T_users snapshot:', error);
  }
  return;
};


export const getAllUsersById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `T_users`, uid); // step 1: change to your collection name
    const docSnap = await getDoc(docRef);

    console.log('Document data:', docSnap.data());

    if (docSnap.exists() && docSnap.data()) {
      console.log('Brokerage details found:', docSnap.data());
      let x = docSnap.data();
      x.id = docSnap.id;
      x.uuid = docSnap.id; 
      // Usually uuid is the same as id in v9 setDoc
      // Ensure img is populated from 'images[0]' if it exists
      if (x['images[0)']) {
        // Fixed typo here - should be 'images[0]'
        x.img = x['images[0]'];
      } else if (!x.img) {
        x.img = '';
      }

      console.log('Transformed banner data (before wrapping):', x); // Log the object before wrapping

      // --- Change is here: Wrap the data in a 'data' property ---
      return { data: x };
      // -------------------------------------------------------
    } else {
      console.log('No brokerage details found.');
      return null; // Or return { data: null } for consistency? Returning null might be fine.
    }
  } catch (error) {
    console.error('Error fetching brokerage details:', error);
    throw error;
  }
};

export const deleteUsers = async (params) => {
  console.log('delete user is ', params);
  console.log(Array.isArray(params), params);
 
 
  const values = Array.isArray(params) ? params : Object.values(params);
 
  values.map(async(item) => {
    await deleteDoc(doc(db, 'T_users', item))
  })
}

// export const updateUsers = async (
//   uid,params

// ) => {
//   try {
  
// console.log('params are ====>', uid,params)
// let x = params
// x['images[0]'] = ""


//     await updateDoc(doc(db, `T_users`, uid), { // step 1: change to your collection name
//       title: x.title,
//       active: x.active
//     })
//     // enqueueSnackbar('Cost Sheet Updated for Customer', {
//     //   variant: 'success',
//     // })
//   } catch (error) {
//     console.log('Failed updated T_users', error, {
//       ...params,
//     })
  
//   }
// }

// 





// Delete Users (multiple)
// export const deleteUsers = async (params) => {
//   console.log('Deleting T_users:', params);
//   params.map(async (item) => {
//     console.log(`Trying to delete user with ID: ${item}`);
//     await deleteDoc(doc(db, 'T_users', item));
//   });
// };


// export const deleteUsers = async (params) => {
//   console.log('delete user is ', params);

//   const ids = Object.values(params); 

//   if (Array.isArray(ids)) {
//     try {
//       await Promise.all(
//         ids.map(async (item) => {
//           await deleteDoc(doc(db, 'T_users', item)); 
//         })
//       );
//       console.log('All T_users deleted successfully');
//     } catch (error) {
//       console.error('Error deleting T_users:', error);
//     }
//   } else {
//     console.error('Expected params to contain an array of IDs, but got:', typeof ids);
//   }
// };

