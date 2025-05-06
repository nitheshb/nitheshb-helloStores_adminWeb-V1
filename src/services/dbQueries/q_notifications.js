// import { db,doc,Timestamp,collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
// import { m } from 'framer-motion';
// import { v4 as uuidv4 } from 'uuid'
// // step 1: change all collection(tables) names in 6 queries 

// export const  createBlogsNotificationsDb = async (orgId, payload)  =>  {
//     // step 2a: check what values are required by going to network call of http://admin.hellostores.com     
//     // step 2b: check what values are coming from parms through console.log
//     const { params } = payload;
//     const myId = uuidv4()
    
//     let input={
//       "id": myId,
//       "uuid": "be52ccb3-6508-4471-9827-ecc8954bcffe",
//       "user_id": 103,
//       "type": "blog",
//       "active": true,
//       "created_at": Timestamp.now().toMillis(),
//       "updated_at": Timestamp.now().toMillis(),
//       "translation": {
//           "id": myId,
//           "locale": "en",
//           "title": params.title.tr,
//           "short_desc": params.short_desc.tr,
//       },
//       "locales": [
//           "en"
//       ]
//   }
//   console.log('my input is ====>', input) 
//     try {
//       const filesCollectionRef = collection(db, `p_blogs_notifications`); // step 1: change to your collection name
//       const { params } = payload;
//       console.log('my brand params in duplicate are ====>', params)
//       const docRef = await addDoc(filesCollectionRef, {...params});
//       console.log('✅ Files saved successfully with ID:', docRef.id);
//       return docRef.id;
//     } catch (error) {
//       console.error('Error saving files to Firestore:', error);
//       throw error;
//     }
//   };


// export const getAllBlogsNotifications = async (orgId, params) => {
//   console.log('params are ====>', params)
//   // const {params} = params
//   let convertStatus =params?.params?.status ==='published' ? 1: 0
//   const filesQuery = query(
//     collection(db, `p_blogs_notifications`), // change to your collection name
//     // where('active', '==', convertStatus),
//   );
//   const querySnapshot = await getDocs(filesQuery);
//   const files = querySnapshot.docs.map((doc) => {
//     let x = doc.data();
//     x.id = doc.id; 
//     x.uuid = doc.id;
//     return x;
//   });
  
//   console.log('my files are ====>', files)
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
//           "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_notifications\/paginate?page=1",
//           "label": "1",
//           "active": true
//       },
//       {
//           "url": null,
//           "label": "Next &raquo;",
//           "active": false
//       }
//   ],
//   "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_notifications\/paginate",
//   "per_page": "1000",
//   "to": files.length,
//   "total": files.length
// }}
//   return y;
// };

// export const getAllBlogsNotificationsSnap = async (params, callback) => {
//   console.log('snap are ====>', params)
//     try {
//     const filesQuery1 = query(
//       collection(db, `T_notifications`), //step 1:  change to your collection name
//       where("status", "==", params?.params?.status || "published")
//     );
//     const itemsQuery1 = query(
//       collection(db, 'T_notifications'),

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
//               url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate?page=1",
//               label: "1",
//               active: true,
//             },
//             { url: null, label: "Next &raquo;", active: false },
//           ],
//           path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate",
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
//       console.error('Error fetching T_notifications:', error);
//   }
//   return     
//   // const {params} = params

// };
// export const getAllBlogsNotificationsById = async (orgId, uid, payload) => {
//   try {
//     const docRef = doc(db, `T_notifications`, uid) // step 1: change to your collection name
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

// export const updateBlogsNotifications = async (
//   uid,params

// ) => {
//   try {
  
// console.log('params are ====>', uid,params)
// let x = params
// x['images[0]'] = ""


//     await updateDoc(doc(db, `T_notifications`, uid), { // step 1: change to your collection name
//       title: x.title,
//       active: x.active
//     })
//     // enqueueSnackbar('Cost Sheet Updated for Customer', {
//     //   variant: 'success',
//     // })
//   } catch (error) {
//     console.log('Failed updated T_notifications', error, {
//       ...params,
//     })
  
//   }
// }
// export const deleteBlogsNotifications = async (params) => {

//   console.log('delete blognotifications is ', params);
 
//   const ids = Object.values(params);
 
//   if (Array.isArray(ids)) {

//     try {

//       await Promise.all(

//         ids.map(async (item) => {

//           await deleteDoc(doc(db, 'p_blogs_notifications', item)); 

//         })

//       );

//       console.log('All blognotifications deleted successfully');

//     } catch (error) {

//       console.error('Error deleting blognotifications:', error);

//     }

//   } else {

//     console.error('Expected params to contain an array of IDs, but got:', typeof ids);

//   }

// };
 






// import { db, doc, Timestamp, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
// import { v4 as uuidv4 } from 'uuid';

// // Standardize collection name across all functions
// const COLLECTION_NAME = 'p_blogs_notifications';

// export const createBlogsNotificationsDb = async (orgId, payload) => {
//   try {
//     const { params } = payload;
//     const myId = uuidv4();
    
//     // Create data structure matching the expected format in your sample output
//     const notificationData = {
//       "id": myId,
//       "uuid": myId,
//       "user_id": 103,
//       "type": "blog",
//       "active": true,
//       "created_at": Timestamp.now().toMillis(),
//       "updated_at": Timestamp.now().toMillis(),
//       "published_at": null,
//       "translation": {
//         "id": myId,
//         "locale": "en",
//         "title": params.title?.tr || params.title.th || params.title.en,
//         "short_desc": params.short_desc?.tr || params.short_desc.th || params.short_desc.en,
//       },
//       "locales": ["en"]
//     };
    
//     console.log('Params', params);
//     console.log('Input data:', notificationData);
    
//     const filesCollectionRef = collection(db, COLLECTION_NAME);
//     const docRef = await addDoc(filesCollectionRef, notificationData);
    
//     console.log('✅ Notification saved successfully with ID:', docRef.id);
//     return docRef.id;
//   } catch (error) {
//     console.error('Error saving notification to Firestore:', error);
//     throw error;
//   }
// };

// export const getAllBlogsNotifications = async (orgId, params) => {
//   console.log('Query params:', params);
  
//   // Convert status parameter if provided
//   const convertStatus = params?.params?.status === 'published' ? 1 : 0;
  
//   try {
//     const filesQuery = query(
//       collection(db, COLLECTION_NAME),
//       // Uncomment this if you want to filter by status
//       // where('active', '==', convertStatus),
//     );
    
//     const querySnapshot = await getDocs(filesQuery);
//     const files = querySnapshot.docs.map((doc) => {
//       const data = doc.data();
//       // Ensure proper structure and IDs are present
//       return {
//         ...data,
//         id: doc.id,
//         uuid: doc.id,
//         // Ensure timestamp objects are properly handled
    
//         published_at: data.published_at || null,
//         // Ensure translation data is properly handled
//         translation: data.translation || {
//           id: doc.id,
//           locale: "en",
//           title: "",
//           short_desc: ""
//         },
//         locales: data.locales || ["en"]
//       };
//     });
    
//     console.log('Retrieved notifications:', files);
    
//     return {
//       data: files,
//       meta: {
//         "current_page": 1,
//         "from": 1,
//         "last_page": 1,
//         "links": [
//           {
//             "url": null,
//             "label": "&laquo; Previous",
//             "active": false
//           },
//           {
//             "url": "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate?page=1",
//             "label": "1",
//             "active": true
//           },
//           {
//             "url": null,
//             "label": "Next &raquo;",
//             "active": false
//           }
//         ],
//         "path": "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate",
//         "per_page": "1000",
//         "to": files.length,
//         "total": files.length
//       }
//     };
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     throw error;
//   }
// };

// export const getAllBlogsNotificationsSnap = async (params, callback) => {
//   console.log('Snapshot listener params:', params);
  
//   try {
//     // Use consistent collection name
//     const filesQuery = query(
//       collection(db, COLLECTION_NAME),
//       // Filter by status if provided
//       params?.params?.status ? where("status", "==", params.params.status) : where("type", "==", "blog")
//     );
    
//     // Subscribe to real-time updates
//     const unsubscribe = onSnapshot(filesQuery, (querySnapshot) => {
//       const files = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           ...data,
//           id: doc.id,
//           uuid: doc.id,
//           // Ensure timestamp objects are properly handled
//           created_at: data.created_at || null,
//           updated_at: data.updated_at || null,
//           published_at: data.published_at || null,
//           // Ensure translation data is properly handled
//           translation: data.translation || {
//             id: doc.id,
//             locale: "en",
//             title: "",
//             short_desc: ""
//           },
//           locales: data.locales || ["en"]
//         };
//       });
    
//       const response = {
//         data: files,
//         meta: {
//           current_page: 1,
//           from: 1,
//           last_page: 1,
//           links: [
//             { url: null, label: "&laquo; Previous", active: false },
//             {
//               url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate?page=1",
//               label: "1",
//               active: true,
//             },
//             { url: null, label: "Next &raquo;", active: false },
//           ],
//           path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate",
//           per_page: "10",
//           to: files.length,
//           total: files.length,
//         },
//       };
    
//       console.log('Snapshot response:', response);
//       callback(response);
//     });
    
//     return unsubscribe;
//   } catch (error) {
//     console.error('Error setting up notification snapshot listener:', error);
//     throw error;
//   }
// };

// // export const getAllBlogsNotificationsById = async (orgId, uid, payload) => {
// //   try {
// //     const docRef = doc(db, COLLECTION_NAME, uid);
// //     const docSnap = await getDoc(docRef);

// //     if (docSnap.exists()) {
// //       const data = docSnap.data();
// //       console.log('Notification details found:', data);
      
// //       return {
// //         ...data,
// //         id: docSnap.id,
// //         uuid: docSnap.id,
// //         // Ensure timestamp objects are properly handled
// //         created_at: data.created_at || null,
// //         updated_at: data.updated_at || null,
// //         published_at: data.published_at || null,
// //         // Ensure translation data is properly handled
// //         translation: data.translation || {
// //           id: docSnap.id,
// //           locale: "en",
// //           title: "",
// //           short_desc: ""
// //         },
// //         locales: data.locales || ["en"],
// //         // Include image if it exists
// //         img: data['images[0]'] || ""
// //       };
// //     } else {
// //       console.log('No notification details found.');
// //       return null;
// //     }
// //   } catch (error) {
// //     console.error('Error fetching notification details:', error);
// //     throw error;
// //   }
// // };

// // export const updateBlogsNotifications = async (uid, params) => {
// //   try {
// //     console.log('Update params:', uid, params);
    
// //     // Create a clean update object with only changed fields
// //     const updateData = {};
    
// //     // Handle basic fields
// //     if (params.title !== undefined) updateData.title = params.title;
// //     if (params.active !== undefined) updateData.active = params.active;
// //     if (params.type !== undefined) updateData.type = params.type;
    
// //     // Handle translation object if provided
// //     if (params.translation) {
// //       updateData.translation = params.translation;
// //     }
    
// //     // Handle image if provided
// //     if (params['images[0]'] !== undefined) {
// //       updateData['images[0]'] = params['images[0]'] || "";
// //     }
    
// //     // Update timestamp
// //     updateData.updated_at = Timestamp.now();
    
// //     await updateDoc(doc(db, COLLECTION_NAME, uid), updateData);
// //     console.log('✅ Notification updated successfully');
    
// //     return true;
// //   } catch (error) {
// //     console.error('Failed to update notification:', error);
// //     throw error;
// //   }
// // };

// export const getAllBlogsNotificationsById = async (orgId, uid, payload) => {
//   try {
//       const docRef = doc(db, `p_blogs_notifications`, uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists() && docSnap.data()) {
//           console.log('Blognotifications details found:', docSnap.data());
//           let unitData = docSnap.data();

//           // Set id and uuid
//           unitData.id = docSnap.id;
//           unitData.uuid = docSnap.id;

//           console.log('unitData is ====>', unitData.translation)

//           // Format data to match what the form expects
//           // If translations doesn't exist or is empty, create it from title data
//           if (!unitData.translations || unitData.translations.length === 0) {
//               // If there's a translation object with locale and title
//               if (unitData.translation && unitData.translation.locale && unitData.translation.title) {
//                   unitData.translations = [{
//                       locale: unitData.translation.locale,
//                       title: unitData.translation.title,
//                       short_desc: unitData.translation.short_desc || "",
//                       description: unitData.translation.description || ""
//                   }];
//               }
//               // If there's a title object with multiple locales
//               else if (typeof unitData.title === 'object') {
//                   unitData.translations = Object.keys(unitData.title).map(locale => ({
//                       locale,
//                       title: unitData.title[locale]
//                   }));
//               }
//           }

//           // Ensure 'active' is a boolean value for the Switch component
//           unitData.active = unitData.active === 1 || unitData.active === true;

//           return { data: unitData };
//       } else {
//           console.log('No Blognotifications details found.');
//           return { data: null };
//       }
//   } catch (error) {
//       console.error('Error fetching Blognotifications details:', error);
//       throw error;
//   }
// };
// export const deleteBlogsNotifications = async (params) => {
//   console.log('Delete notifications params:', params);
  
//   const ids = Object.values(params);
  
//   if (Array.isArray(ids)) {
//     try {
//       await Promise.all(
//         ids.map(async (item) => {
//           await deleteDoc(doc(db, COLLECTION_NAME, item));
//         })
//       );
      
//       console.log('✅ All notifications deleted successfully');
//       return true;
//     } catch (error) {
//       console.error('Error deleting notifications:', error);
//       throw error;
//     }
//   } else {
//     console.error('Expected params to contain an array of IDs, but got:', typeof ids);
//     throw new Error('Invalid parameter format for deletion');
//   }
// };

// export const updateBlogsNotifications = async (uid, params) => {

//   try {

//     console.log('Update params:', uid, params);

//     // Get the current document to properly merge changes

//     const docRef = doc(db, COLLECTION_NAME, uid);

//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists()) {

//       console.error('Cannot update non-existent document:', uid);

//       throw new Error('Document not found');

//     }

//     const currentData = docSnap.data();

//     console.log('Current document data:', currentData);

//     // Create update object with careful handling of nested structures

//     const updateData = {};

//     // Always update the timestamp

//     updateData.updated_at = Timestamp.now().toMillis();

//     // Handle active status if provided

//     if (params.active !== undefined) {

//       updateData.active = Boolean(params.active);

//     }

//     // Handle type if provided

//     if (params.type !== undefined) {

//       updateData.type = params.type;

//     }

//     // Handle translation updates based on the input format

//     // Format appears to be: { title: { tr: "UI Team" }, description: { tr: "MI Team" }, short_desc: { tr: "AI Team" } }

//     if (!updateData.translation) {

//       updateData.translation = { ...currentData.translation };

//     }

//     // Handle title from various possible formats

//     if (params.title) {

//       if (typeof params.title === 'string') {

//         updateData.translation.title = params.title;

//       } else if (params.title.tr || params.title.en || params.title.th) {

//         updateData.translation.title = params.title.tr || params.title.en || params.title.th;

//       }

//     }

//     // Handle short_desc from various possible formats

//     if (params.short_desc) {

//       if (typeof params.short_desc === 'string') {

//         updateData.translation.short_desc = params.short_desc;

//       } else if (params.short_desc.tr || params.short_desc.en || params.short_desc.th) {

//         updateData.translation.short_desc = params.short_desc.tr || params.short_desc.en || params.short_desc.th;

//       }

//     }

//     // Handle description if provided (not in current structure but included in your input)

//     if (params.description) {

//       if (typeof params.description === 'string') {

//         updateData.translation.description = params.description;

//       } else if (params.description.tr || params.description.en || params.description.th) {

//         updateData.translation.description = params.description.tr || params.description.en || params.description.th;

//       }

//     }

//     // Handle nested params structure if it exists

//     if (params.params) {

//       // Handle title

//       if (params.params.title) {

//         if (typeof params.params.title === 'string') {

//           updateData.translation.title = params.params.title;

//         } else if (params.params.title.tr || params.params.title.en || params.params.title.th) {

//           updateData.translation.title = params.params.title.tr || params.params.title.en || params.params.title.th;

//         }

//       }

//       // Handle short description

//       if (params.params.short_desc) {

//         if (typeof params.params.short_desc === 'string') {

//           updateData.translation.short_desc = params.params.short_desc;

//         } else if (params.params.short_desc.tr || params.params.short_desc.en || params.params.short_desc.th) {

//           updateData.translation.short_desc = params.params.short_desc.tr || params.params.short_desc.en || params.params.short_desc.th;

//         }

//       }

//       // Handle description

//       if (params.params.description) {

//         if (typeof params.params.description === 'string') {

//           updateData.translation.description = params.params.description;

//         } else if (params.params.description.tr || params.params.description.en || params.params.description.th) {

//           updateData.translation.description = params.params.description.tr || params.params.description.en || params.params.description.th;

//         }

//       }

//     }

//     // Handle direct translation updates

//     if (params.translation) {

//       updateData.translation = {

//         ...(currentData.translation || {}),

//         ...params.translation

//       };

//     }

//     // Handle image if provided

//     if (params['images[0]'] !== undefined) {

//       updateData['images[0]'] = params['images[0]'];

//     }

//     // Handle published_at if provided

//     if (params.published_at !== undefined) {

//       updateData.published_at = params.published_at;

//     }

//     console.log('Updating document with data:', updateData);

//     // Make sure we're actually updating something

//     if (Object.keys(updateData).length === 0) {

//       console.warn('No fields to update');

//       return { id: uid, ...currentData };

//     }

//     // Perform the update

//     await updateDoc(docRef, updateData);

//     console.log('✅ Notification updated successfully');

//     // Return the updated data

//     return { 

//       id: uid, 

//       ...currentData,

//       ...updateData,

//       // Ensure these fields are properly returned

//       uuid: uid,

//       translation: updateData.translation || currentData.translation

//     };

//   } catch (error) {

//     console.error('Failed to update notification:', error);

//     throw error;

//   }

// };









 
import { db, doc, Timestamp, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
import { v4 as uuidv4 } from 'uuid';
 
// Standardize collection name across all functions
const COLLECTION_NAME = 'p_blogs_notifications';
 
// Function to modify: getAllBlogsNotifications
export const getAllBlogsNotifications = async (orgId, params) => {
  console.log('Query params:', params);
 
  // Get the requested language from params or default to English
  const requestedLocale = params?.locale || "en";
 
  try {
    const filesQuery = query(
      collection(db, COLLECTION_NAME),
      // Uncomment this if you want to filter by status
      // where('active', '==', convertStatus),
    );
   
    const querySnapshot = await getDocs(filesQuery);
    const files = querySnapshot.docs.map((doc) => {
      const data = doc.data();
     
      // Find the translation for the requested language
      let translationToUse = null;
     
      // First check translations array
      if (data.translations && Array.isArray(data.translations)) {
        translationToUse = data.translations.find(t => t.locale === requestedLocale);
      }
     
      // If not found, check the main translation object if it matches
      if (!translationToUse && data.translation?.locale === requestedLocale) {
        translationToUse = data.translation;
      }
     
      // If still not found, fall back to English or first available
      if (!translationToUse) {
        if (data.translations?.length > 0) {
          translationToUse = data.translations.find(t => t.locale === "en") ||
                           data.translations[0];
        } else if (data.translation) {
          translationToUse = data.translation;
        }
      }
     
      // If we still don't have a translation, create a default one
      if (!translationToUse) {
        translationToUse = {
          locale: requestedLocale,
          title: "",
          short_desc: ""
        };
      }
     
      // Return data with the requested translation
      return {
        ...data,
        id: doc.id,
        uuid: doc.id,
        published_at: data.published_at || null,
        translation: {
          id: doc.id,
          locale: translationToUse.locale,
          title: translationToUse.title || "",
          short_desc: translationToUse.short_desc || ""
        },
        // MODIFIED: Only show 'en' locale in the UI
        locales: ["en"]
      };
    });
   
    console.log('Retrieved notifications:', files);
   
    return {
      data: files,
      meta: {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "links": [
          {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
          },
          {
            "url": "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate?page=1",
            "label": "1",
            "active": true
          },
          {
            "url": null,
            "label": "Next &raquo;",
            "active": false
          }
        ],
        "path": "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate",
        "per_page": "1000",
        "to": files.length,
        "total": files.length
      }
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};
 
// Function to modify: createBlogsNotificationsDb
export const createBlogsNotificationsDb = async (orgId, payload) => {
  try {
    const { params } = payload;
 
        // 1. Log the incoming payload (check for unexpected defaults)
        console.log("Payload received:", JSON.stringify(payload, null, 2));
 
    const myId = uuidv4();
   
    // Create data structure matching the expected format
    const notificationData = {
      "id": myId,
      "uuid": myId,
      "user_id": 103,
      "type": "blog",
      "active": true,
      "created_at": Timestamp.now().toMillis(),
      "updated_at": Timestamp.now().toMillis(),
      "published_at": null
    };
 
 
   
    // Initialize translations array and store all actual locales
    const translations = [];
    // Start with an empty locales set - only add languages that have actual content
    const locales = new Set();
   
    // Process multilingual content if available
    // Only add languages that actually have content, not empty defaults
    if (params.title && typeof params.title === 'object') {
      // Handle each language in the title object
      Object.keys(params.title).forEach(locale => {
        if (["en", "th", "tr"].includes(locale) && params.title[locale]) {
          locales.add(locale);
         
          // Create or update translation for this language
          const existingTransIndex = translations.findIndex(t => t.locale === locale);
         
          if (existingTransIndex === -1) {
            translations.push({
              locale,
              title: params.title[locale] || "",
              short_desc: params.short_desc?.[locale] || "",
              description: params.description?.[locale] || ""
            });
          } else {
            translations[existingTransIndex].title = params.title[locale];
          }
        }
      });
    }
   
    // Add short descriptions for each language
    if (params.short_desc && typeof params.short_desc === 'object') {
      Object.keys(params.short_desc).forEach(locale => {
        if (["en", "th", "tr"].includes(locale) && params.short_desc[locale]) {
          locales.add(locale);
         
          const existingTransIndex = translations.findIndex(t => t.locale === locale);
         
          if (existingTransIndex === -1) {
            translations.push({
              locale,
              title: params.title?.[locale] || "",
              short_desc: params.short_desc[locale] || "",
              description: params.description?.[locale] || ""
            });
          } else {
            translations[existingTransIndex].short_desc = params.short_desc[locale];
          }
        }
      });
    }
   
    // Add descriptions for each language
    if (params.description && typeof params.description === 'object') {
      Object.keys(params.description).forEach(locale => {
        if (["en", "th", "tr"].includes(locale) && params.description[locale]) {
          locales.add(locale);
         
          const existingTransIndex = translations.findIndex(t => t.locale === locale);
         
          if (existingTransIndex === -1) {
            translations.push({
              locale,
              title: params.title?.[locale] || "",
              short_desc: params.short_desc?.[locale] || "",
              description: params.description[locale] || ""
            });
          } else {
            translations[existingTransIndex].description = params.description[locale];
          }
        }
      });
    }
   
    // If no translations were added, add a default English one
    if (translations.length === 0) {
      locales.add("en");
      translations.push({
        locale: "en",
        title: typeof params.title === 'string' ? params.title : "",
        short_desc: typeof params.short_desc === 'string' ? params.short_desc : "",
        description: typeof params.description === 'string' ? params.description : ""
      });
    }
   
    // Set the default translation (prioritize English)
    const defaultTranslation = translations.find(t => t.locale === "en") || translations[0];
   
    // Add translations and locales to the notification data
    notificationData.translations = translations;
    // IMPORTANT: Store all actual locales in the database
    notificationData.locales = Array.from(locales);
    notificationData.translation = {
      id: myId,
      locale: defaultTranslation.locale,
      title: defaultTranslation.title,
      short_desc: defaultTranslation.short_desc,
      description: defaultTranslation.description
    };
   
    console.log('Input data:', notificationData);
   
    const filesCollectionRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(filesCollectionRef, notificationData);
   
    console.log('✅ Notification saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving notification to Firestore:', error);
    throw error;
  }
};
 
// Function to modify: updateBlogsNotifications
export const updateBlogsNotifications = async (uid, params) => {
  try {
    console.log('Update params:', uid, params);
    // Get the current document to properly merge changes
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('Cannot update non-existent document:', uid);
      throw new Error('Document not found');
    }
    const currentData = docSnap.data();
    console.log('Current document data:', currentData);
   
    // Create update object with careful handling of nested structures
    const updateData = {};
    // Always update the timestamp
    updateData.updated_at = Timestamp.now().toMillis();
   
    // Handle active status if provided
    if (params.active !== undefined) {
      updateData.active = Boolean(params.active);
    }
   
    // Handle type if provided
    if (params.type !== undefined) {
      updateData.type = params.type;
    }
   
    // Start with existing translations or create empty array
    let translations = [...(currentData.translations || [])];
   
    // Process translations for each language
    const supportedLocales = ["en", "th", "tr"];
   
    // IMPORTANT: When updating, respect all original languages
    // For database storage, keep all locales even though UI only shows English
    const locales = new Set(currentData.locales || ["en"]);
   
    // Handle title, short_desc, and description for each language
    if (params.title && typeof params.title === 'object') {
      // For each language in the title object
      Object.keys(params.title).forEach(locale => {
        if (supportedLocales.includes(locale) && params.title[locale]) {
          // Add the locale to the list of supported locales if not already there
          locales.add(locale);
         
          // Find existing translation for this locale or create new one
          let translationIndex = translations.findIndex(t => t.locale === locale);
          if (translationIndex === -1) {
            translations.push({
              locale,
              title: params.title[locale] || "",
              short_desc: "",
              description: ""
            });
            translationIndex = translations.length - 1;
          }
         
          // Update the title
          translations[translationIndex].title = params.title[locale];
         
          // If this is the default locale (en), also update the translation object
          if (locale === (currentData.translation?.locale || "en")) {
            if (!updateData.translation) {
              updateData.translation = { ...currentData.translation } || { id: uid, locale };
            }
            updateData.translation.title = params.title[locale];
          }
        }
      });
    }
   
    // Similar process for short_desc
    if (params.short_desc && typeof params.short_desc === 'object') {
      Object.keys(params.short_desc).forEach(locale => {
        if (supportedLocales.includes(locale) && params.short_desc[locale]) {
          locales.add(locale);
         
          let translationIndex = translations.findIndex(t => t.locale === locale);
          if (translationIndex === -1) {
            translations.push({
              locale,
              title: "",
              short_desc: params.short_desc[locale] || "",
              description: ""
            });
            translationIndex = translations.length - 1;
          }
         
          translations[translationIndex].short_desc = params.short_desc[locale];
         
          if (locale === (currentData.translation?.locale || "en")) {
            if (!updateData.translation) {
              updateData.translation = { ...currentData.translation } || { id: uid, locale };
            }
            updateData.translation.short_desc = params.short_desc[locale];
          }
        }
      });
    }
   
    // Similar process for description
    if (params.description && typeof params.description === 'object') {
      Object.keys(params.description).forEach(locale => {
        if (supportedLocales.includes(locale) && params.description[locale]) {
          locales.add(locale);
         
          let translationIndex = translations.findIndex(t => t.locale === locale);
          if (translationIndex === -1) {
            translations.push({
              locale,
              title: "",
              short_desc: "",
              description: params.description[locale] || ""
            });
            translationIndex = translations.length - 1;
          }
         
          translations[translationIndex].description = params.description[locale];
         
          if (locale === (currentData.translation?.locale || "en")) {
            if (!updateData.translation) {
              updateData.translation = { ...currentData.translation } || { id: uid, locale };
            }
            updateData.translation.description = params.description[locale];
          }
        }
      });
    }
   
    // Handle nested params structure if it exists (similar pattern as above)
    if (params.params) {
      // Handle title in params
      if (params.params.title && typeof params.params.title === 'object') {
        Object.keys(params.params.title).forEach(locale => {
          if (supportedLocales.includes(locale) && params.params.title[locale]) {
            locales.add(locale);
           
            let translationIndex = translations.findIndex(t => t.locale === locale);
            if (translationIndex === -1) {
              translations.push({
                locale,
                title: params.params.title[locale] || "",
                short_desc: "",
                description: ""
              });
              translationIndex = translations.length - 1;
            }
           
            translations[translationIndex].title = params.params.title[locale];
           
            if (locale === (currentData.translation?.locale || "en")) {
              if (!updateData.translation) {
                updateData.translation = { ...currentData.translation } || { id: uid, locale };
              }
              updateData.translation.title = params.params.title[locale];
            }
          }
        });
      }
     
      // Handle short_desc in params
      if (params.params.short_desc && typeof params.params.short_desc === 'object') {
        Object.keys(params.params.short_desc).forEach(locale => {
          if (supportedLocales.includes(locale) && params.params.short_desc[locale]) {
            locales.add(locale);
           
            let translationIndex = translations.findIndex(t => t.locale === locale);
            if (translationIndex === -1) {
              translations.push({
                locale,
                title: "",
                short_desc: params.params.short_desc[locale] || "",
                description: ""
              });
              translationIndex = translations.length - 1;
            }
           
            translations[translationIndex].short_desc = params.params.short_desc[locale];
           
            if (locale === (currentData.translation?.locale || "en")) {
              if (!updateData.translation) {
                updateData.translation = { ...currentData.translation } || { id: uid, locale };
              }
              updateData.translation.short_desc = params.params.short_desc[locale];
            }
          }
        });
      }
     
      // Handle description in params
      if (params.params.description && typeof params.params.description === 'object') {
        Object.keys(params.params.description).forEach(locale => {
          if (supportedLocales.includes(locale) && params.params.description[locale]) {
            locales.add(locale);
           
            let translationIndex = translations.findIndex(t => t.locale === locale);
            if (translationIndex === -1) {
              translations.push({
                locale,
                title: "",
                short_desc: "",
                description: params.params.description[locale] || ""
              });
              translationIndex = translations.length - 1;
            }
           
            translations[translationIndex].description = params.params.description[locale];
           
            if (locale === (currentData.translation?.locale || "en")) {
              if (!updateData.translation) {
                updateData.translation = { ...currentData.translation } || { id: uid, locale };
              }
              updateData.translation.description = params.params.description[locale];
            }
          }
        });
      }
    }
   
    // Handle string values for title, short_desc, and description (fallback to default locale)
    const defaultLocale = currentData.translation?.locale || "en";
   
    if (params.title && typeof params.title === 'string') {
      const translationIndex = translations.findIndex(t => t.locale === defaultLocale);
      if (translationIndex !== -1) {
        translations[translationIndex].title = params.title;
      }
     
      if (!updateData.translation) {
        updateData.translation = { ...currentData.translation } || { id: uid, locale: defaultLocale };
      }
      updateData.translation.title = params.title;
    }
   
    if (params.short_desc && typeof params.short_desc === 'string') {
      const translationIndex = translations.findIndex(t => t.locale === defaultLocale);
      if (translationIndex !== -1) {
        translations[translationIndex].short_desc = params.short_desc;
      }
     
      if (!updateData.translation) {
        updateData.translation = { ...currentData.translation } || { id: uid, locale: defaultLocale };
      }
      updateData.translation.short_desc = params.short_desc;
    }
   
    if (params.description && typeof params.description === 'string') {
      const translationIndex = translations.findIndex(t => t.locale === defaultLocale);
      if (translationIndex !== -1) {
        translations[translationIndex].description = params.description;
      }
     
      if (!updateData.translation) {
        updateData.translation = { ...currentData.translation } || { id: uid, locale: defaultLocale };
      }
      updateData.translation.description = params.description;
    }
   
    // Set the updated translations and original locales for storage in DB
    updateData.translations = translations;
    updateData.locales = Array.from(locales);
   
    // If translation wasn't updated but exists in current data, preserve it
    if (!updateData.translation && currentData.translation) {
      updateData.translation = { ...currentData.translation };
     
      // Make sure it has all necessary fields
      if (!updateData.translation.id) updateData.translation.id = uid;
      if (!updateData.translation.locale) updateData.translation.locale = "en";
    }
   
    // Handle image if provided
    if (params['images[0]'] !== undefined) {
      updateData['images[0]'] = params['images[0]'];
    }
   
    // Handle published_at if provided
    if (params.published_at !== undefined) {
      updateData.published_at = params.published_at;
    }
   
    console.log('Updating document with data:', updateData);
   
    // Make sure we're actually updating something
    if (Object.keys(updateData).length === 0) {
      console.warn('No fields to update');
      return { id: uid, ...currentData };
    }
   
    // Perform the update
    await updateDoc(docRef, updateData);
    console.log('✅ Notification updated successfully');
   
    // Get the English translation for the return data
    const englishTranslation = updateData.translations?.find(t => t.locale === "en") ||
                              currentData.translations?.find(t => t.locale === "en") ||
                              { locale: "en", title: "", short_desc: "", description: "" };
   
    // Create return data - keep all original data but modify for UI display
    const returnData = {
      id: uid,
      ...currentData,
      ...updateData,
      uuid: uid,
      translation: updateData.translation || currentData.translation,
      translations: updateData.translations || currentData.translations || [],
      // MODIFIED: For UI display, only show English
      locales: ["en"]
    };
   
    return returnData;
  } catch (error) {
    console.error('Failed to update notification:', error);
    throw error;
  }
};
 
// Function to modify: getAllBlogsNotificationsById
export const getAllBlogsNotificationsById = async (orgId, uid, payload) => {
  try {
    // Get the requested language from payload or default to English
    const requestedLocale = payload?.locale || "en";
   
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
 
    if (docSnap.exists() && docSnap.data()) {
      let notificationData = docSnap.data();
      console.log('Notification details found:', notificationData);
     
      // Set id and uuid consistently
      notificationData.id = docSnap.id;
      notificationData.uuid = docSnap.id;
     
      // Ensure active is a boolean value
      notificationData.active = notificationData.active === 1 || notificationData.active === true;
     
      // Find the translation for the requested language
      let requestedTranslation = null;
     
      // First check translations array
      if (notificationData.translations && Array.isArray(notificationData.translations)) {
        requestedTranslation = notificationData.translations.find(t => t.locale === requestedLocale);
      }
     
      // If not found in translations array, check the main translation object
      if (!requestedTranslation && notificationData.translation?.locale === requestedLocale) {
        requestedTranslation = notificationData.translation;
      }
     
      // If still not found, fall back to English or first available
      if (!requestedTranslation) {
        if (notificationData.translations?.length > 0) {
          // Try English first
          requestedTranslation = notificationData.translations.find(t => t.locale === "en") ||
                               notificationData.translations[0];
        } else if (notificationData.translation) {
          requestedTranslation = notificationData.translation;
        }
      }
     
      // If we still don't have a translation, create a default one
      if (!requestedTranslation) {
        requestedTranslation = {
          locale: requestedLocale,
          title: "",
          short_desc: "",
          description: ""
        };
      }
     
      // Process existing translations - only include ones with actual content
      const filteredTranslations = [];
      if (notificationData.translations && Array.isArray(notificationData.translations)) {
        notificationData.translations.forEach(trans => {
          if (trans.title || trans.short_desc || trans.description) {
            filteredTranslations.push({
              locale: trans.locale,
              title: trans.title || "",
              short_desc: trans.short_desc || "",
              description: trans.description || ""
            });
          }
        });
      }
     
      // Update translations in the data
      notificationData.translations = filteredTranslations;
     
      // Store all original locales for editing
      notificationData._originalLocales = filteredTranslations.map(t => t.locale);
     
      // MODIFIED: For UI display, only show English
      notificationData.locales = ["en"];
     
      // Set the main translation to the requested one
      notificationData.translation = {
        id: docSnap.id,
        locale: requestedTranslation.locale,
        title: requestedTranslation.title || "",
        short_desc: requestedTranslation.short_desc || "",
        description: requestedTranslation.description || ""
      };
     
      // Ensure timestamp fields exist
      notificationData.created_at = notificationData.created_at || null;
      notificationData.updated_at = notificationData.updated_at || null;
      notificationData.published_at = notificationData.published_at || null;
     
      // Format image field
      if (notificationData['images[0]'] !== undefined) {
        notificationData.img = notificationData['images[0]'];
      }
     
      console.log('Returning formatted notification data:', notificationData);
      return { data: notificationData };
    } else {
      console.log('No notification details found.');
      return { data: null };
    }
  } catch (error) {
    console.error('Error fetching notification details:', error);
    throw error;
  }
};
 
// Function to modify: getAllBlogsNotificationsSnap
export const getAllBlogsNotificationsSnap = async (params, callback) => {
  console.log('Snapshot listener params:', params);
 
  try {
    // Use consistent collection name
    const filesQuery = query(
      collection(db, COLLECTION_NAME),
      // Filter by status if provided
      params?.params?.status ? where("status", "==", params.params.status) : where("type", "==", "blog")
    );
   
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(filesQuery, (querySnapshot) => {
      const files = querySnapshot.docs.map((doc) => {
        const data = doc.data();
       
        // Use the original translation object if available
        let translationToUse = data.translation || {};
       
        // If no translation was found, check if there's any in the translations array
        if (!translationToUse.locale && data.translations && Array.isArray(data.translations) && data.translations.length > 0) {
          // MODIFIED: Only find English translation
          translationToUse = data.translations.find(t => t.locale === "en") || data.translations[0];
        }
       
        // If we still don't have a proper translation, create a default one
        if (!translationToUse.locale) {
          translationToUse = {
            locale: "en",
            title: "",
            short_desc: ""
          };
        }
       
        return {
          ...data,
          id: doc.id,
          uuid: doc.id,
          // Ensure timestamp objects are properly handled
          created_at: data.created_at || null,
          updated_at: data.updated_at || null,
          published_at: data.published_at || null,
          // Keep the original translation
          translation: {
            id: doc.id,
            locale: translationToUse.locale,
            title: translationToUse.title || "",
            short_desc: translationToUse.short_desc || ""
          },
          // MODIFIED: Only show 'en' locale in the UI
          locales: ["en"]
        };
      });
   
      const response = {
        data: files,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [
            { url: null, label: "&laquo; Previous", active: false },
            {
              url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate?page=1",
              label: "1",
              active: true,
            },
            { url: null, label: "Next &raquo;", active: false },
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_notifications/paginate",
          per_page: "10",
          to: files.length,
          total: files.length,
        },
      };
   
      console.log('Snapshot response:', response);
      callback(response);
    });
   
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up notification snapshot listener:', error);
    throw error;
  }
};
 
export const deleteBlogsNotifications = async (params) => {
  console.log('Delete notifications params:', params);
 
  const ids = Object.values(params);
 
  if (Array.isArray(ids)) {
    try {
      await Promise.all(
        ids.map(async (item) => {
          await deleteDoc(doc(db, COLLECTION_NAME, item));
        })
      );
     
      console.log('✅ All notifications deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting notifications:', error);
      throw error;
    }
  } else {
    console.error('Expected params to contain an array of IDs, but got:', typeof ids);
    throw new Error('Invalid parameter format for deletion');
  }
};
 
//  Corrected setActiveNotifications function to use the same collection as other functions
export const setActiveNotifications = async (id) => {
  try {
    // Extract the actual ID from the path if needed
    const notificationId = id.includes('/') ? id.split('/').pop() : id;
    console.log('Toggling active status for notification ID:', notificationId);
 
    // Use the same collection name as all other functions
    const docRef = doc(db, COLLECTION_NAME, notificationId);
    const docSnap = await getDoc(docRef);
 
    if (!docSnap.exists()) {
      console.error(`Notification with ID ${notificationId} not found`);
      throw new Error(`Notification with ID ${notificationId} not found`);
    }
 
    // Get current data and toggle the active status
    const notificationData = docSnap.data();
    const currentActive = notificationData.active === 1 || notificationData.active === true;
    const newActive = !currentActive;
    console.log(`Toggling active status from ${currentActive} to ${newActive}`);
 
    // Update the document with the toggled active status
    await updateDoc(docRef, {
      active: newActive,
      updated_at: Timestamp.now().toMillis()
    });
 
    // Find the main translation (prioritize English)
    let mainTranslation = null;
    if (notificationData.translations && Array.isArray(notificationData.translations)) {
      mainTranslation = notificationData.translations.find(t => t.locale === "en") ||
                       notificationData.translations[0];
    }
   
    // If no translation in array, use the main translation object
    if (!mainTranslation && notificationData.translation) {
      mainTranslation = notificationData.translation;
    }
 
    // If still no translation, create a default one
    if (!mainTranslation) {
      mainTranslation = {
        locale: "en",
        title: "",
        short_desc: "",
        description: ""
      };
    }
 
    // Prepare and return the response in the expected format
    const response = {
      timestamp: new Date().toISOString(),
      status: true,
      data: {
        id: notificationId,
        active: newActive,
        created_at: notificationData.created_at || Timestamp.now().toMillis(),
        updated_at: Timestamp.now().toMillis(),
        published_at: notificationData.published_at || null,
        translation: {
          id: notificationId,
          locale: mainTranslation.locale || "en",
          title: mainTranslation.title || "",
          short_desc: mainTranslation.short_desc || ""
        },
        // Only include English for UI display
        locales: ["en"]
      }
    };
 
    console.log('Notification active status toggled successfully:', response);
    return response;
  } catch (error) {
    console.error('Error toggling notification active status:', error);
    throw error;
  }
};
 
 

