// import { db,doc,collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
// // step 1: change all collection(tables) names in 6 queries 

// export const  createBrandDb = async (orgId, payload)  =>  {
//     // step 2a: check what values are required by going to network call of http://admin.hellostores.com     
//     // step 2b: check what values are coming from parms through console.log
//     try {
//       const filesCollectionRef = collection(db, `T_extra_groups`); // step 1: change to your collection name
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





// export const getAllBrands = async (orgId, params) => {
//   console.log('params are ====>', params)
//   // const {params} = params
//   let convertStatus =params?.params?.status ==='published' ? 1: 0
//   const filesQuery = query(
//     collection(db, `T_extra_groups`), // change to your collection name
//     where('active', '==', convertStatus),
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
//           "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_extra_groups\/paginate?page=1",
//           "label": "1",
//           "active": true
//       },
//       {
//           "url": null,
//           "label": "Next &raquo;",
//           "active": false
//       }
//   ],
//   "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_extra_groups\/paginate",
//   "per_page": "1000",
//   "to": files.length,
//   "total": files.length
// }}
//   return y;
// };

// export const getAllBrandsSnap = async (params, callback) => {
//   console.log('snap are ====>', params)
//     try {
//     const filesQuery1 = query(
//       collection(db, `T_extra_groups`), //step 1:  change to your collection name
//       where("status", "==", params?.params?.status || "published")
//     );
//     const itemsQuery1 = query(
//       collection(db, 'T_extra_groups'),

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
//               url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_extra_groups/paginate?page=1",
//               label: "1",
//               active: true,
//             },
//             { url: null, label: "Next &raquo;", active: false },
//           ],
//           path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_extra_groups/paginate",
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
//       console.error('Error fetching T_extra_groups:', error);
//   }
//   return     
//   // const {params} = params

// };
// export const getAllBrandsById = async (orgId, uid, payload) => {
//   try {
//     const docRef = doc(db, `T_extra_groups`, uid) // step 1: change to your collection name
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

// export const updateBrand = async (
//   uid,params

// ) => {
//   try {
  
// console.log('params are ====>', uid,params)
// let x = params
// x['images[0]'] = ""


//     await updateDoc(doc(db, `T_extra_groups`, uid), { // step 1: change to your collection name
//       title: x.title,
//       active: x.active
//     })
//     // enqueueSnackbar('Cost Sheet Updated for Customer', {
//     //   variant: 'success',
//     // })
//   } catch (error) {
//     console.log('Failed updated T_extra_groups', error, {
//       ...params,
//     })
  
//   }
// }
// export const deleteBrand= async (params) => {
//   console.log('delte user is ', params)
//   params.map(async(item) => {
//    await deleteDoc(doc(db, 'T_extra_groups', item)) // step 1: change to your collection name
//   })

// }


import { db, doc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, Timestamp } from 'db';
import { v4 as uuidv4 } from 'uuid';
 
// Collection name stored in a constant for easier maintenance
const COLLECTION_NAME = 'T_extra_groups';
 
export const createGroupsDb = async (orgId, payload) => {
  const filesCollectionRef = collection(db, 'T_extra_groups');
  const { params } = payload;
  const myId = uuidv4();

  // Extract all locale data from params
  const translations = [];
  const locales = [];
  const titleData = {};

  // Process all title fields with pattern title[locale]
  if (params.title) {
    if (typeof params.title === 'string') {
      const selectedLanguage = params.selectedLanguage || 'en'; // Default to 'en' if no language is selected
      titleData[selectedLanguage] = params.title;

      translations.push({
        locale: selectedLanguage,
        title: params.title,
      });

      locales.push(selectedLanguage); // Add selected language to locales array
    } else if (typeof params.title === 'object') {
      Object.keys(params.title).forEach(lang => {
        if (params.title[lang] && params.title[lang].trim() !== '') {
          titleData[lang] = params.title[lang];

          translations.push({
            locale: lang,
            title: params.title[lang],
          });

          // Add locale to locales array
          if (!locales.includes(lang)) {
            locales.push(lang);
          }
        }
      });
    }
  }

  // Default to 'en' if no locales found
  if (locales.length === 0) {
    locales.push('en');
  }

  // Use the first locale as the primary translation
  const primaryLocale = locales[0];
  const primaryTitle = titleData[primaryLocale] || '';

  let input = {
    "id": myId,
    "type": "text",
    "active": true,
    "translation": { // Primary translation for backward compatibility
      "id": myId,
      "locale": primaryLocale,
      "title": primaryTitle,
    },
    "title": titleData, // Store all titles by locale
    "translations": translations, // Store array of all translations
    "locales": locales, // Store all available locales
    "shop": null, // Assuming shop is a placeholder, can be removed if not needed
  };

  console.log('Group data:', input);

  try {
    const docRef = await addDoc(filesCollectionRef, input);
    console.log('Group saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving group to Firestore:', error);
    throw error;
  }
};


export const getAllGroups = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  let convertStatus =params?.params?.status ==='published' ? 1: 0
  const filesQuery = query(
    collection(db, `T_extra_groups`), // change to your collection name
    // where('active', '==', convertStatus),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
   "meta": {
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
          "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_extra_groups\/paginate?page=1",
          "label": "1",
          "active": true
      },
      {
          "url": null,
          "label": "Next &raquo;",
          "active": false
      }
  ],
  "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_extra_groups\/paginate",
  "per_page": "1000",
  "to": files.length,
  "total": files.length
}}
  return y;
};

export const getAllGroupsById = async (orgId, uid, payload) => {
  try {
      const docRef = doc(db, `T_extra_groups`, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data()) {
          console.log('Unit details found:', docSnap.data());
          let unitData = docSnap.data();

          // Set id and uuid
          unitData.id = docSnap.id;
          unitData.uuid = docSnap.id;

          // Format data to match what the form expects
          // If translations doesn't exist or is empty, create it from title data
          if (!unitData.translations || unitData.translations.length === 0) {
              // If there's a translation object with locale and title
              if (unitData.translation && unitData.translation.locale && unitData.translation.title) {
                  unitData.translations = [{
                      locale: unitData.translation.locale,
                      title: unitData.translation.title
                  }];
              }
              // If there's a title object with multiple locales
              else if (typeof unitData.title === 'object') {
                  unitData.translations = Object.keys(unitData.title).map(locale => ({
                      locale,
                      title: unitData.title[locale]
                  }));
              }
          }

          // Ensure 'active' is a boolean value for the Switch component
          unitData.active = unitData.active === 1 || unitData.active === true;

          return { data: unitData };
      } else {
          console.log('No unit details found.');
          return { data: null };
      }
  } catch (error) {
      console.error('Error fetching unit details:', error);
      throw error;
  }
};

export const updateGroups = async (uid, params) => {
  try {
    console.log('params being passed to update function:', uid, params);

    // Extract all locale data from params
    const titleData = {};
    const translations = [];
    const locales = [];

    // Process all title fields with pattern title[locale]
    if (params.title) {
      if (typeof params.title === 'string') {
        const selectedLanguage = params.selectedLanguage || 'en'; // Default to 'en' if no language is selected
        titleData[selectedLanguage] = params.title;

        translations.push({
          locale: selectedLanguage,
          title: params.title,
        });

        locales.push(selectedLanguage); // Add selected language to locales array
      } else if (typeof params.title === 'object') {
        Object.keys(params.title).forEach(lang => {
          if (params.title[lang] && params.title[lang].trim() !== '') {
            titleData[lang] = params.title[lang];

            translations.push({
              locale: lang,
              title: params.title[lang],
            });

            // Add locale to locales array
            if (!locales.includes(lang)) {
              locales.push(lang);
            }
          }
        });
      }
    }

    console.log('Title data extracted:', titleData);
    console.log('Translations extracted:', translations);
    console.log('Locales extracted:', locales);

    // Default to 'en' if no locales found
    if (locales.length === 0) {
      locales.push('en');
    }

    // Prepare update data with fields from the API response structure
    const updateData = {
      active: params.active === true || params.active === 1 ? 1 : 0,
      updated_at: Timestamp.now().toMillis(),
      locales: locales.length > 0 ? locales : ['en'], // Default to 'en' if no locales
    };

    // Only include title and translations if we have valid data
    if (Object.keys(titleData).length > 0) {
      updateData.title = titleData;
      updateData.translations = translations;

      // Add a single translation object for backward compatibility
      if (translations.length > 0) {
        updateData.translation = {
          locale: translations[0].locale,
          title: translations[0].title,
        };
      }
    }

    console.log('Update data being saved to Firestore:', updateData);

    // Update the group document
    await updateDoc(doc(db, `T_extra_groups`, uid), updateData);
    console.log('Group updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to update group', error);
    throw error;
  }
};

export const deleteGroups = async (params) => {
  console.log('delete groups is ', params);
 
  const ids = Object.values(params);
 
  if (Array.isArray(ids)) {
    try {
      await Promise.all(
        ids.map(async (item) => {
          await deleteDoc(doc(db, COLLECTION_NAME, item));
        })
      );
      console.log('All groups deleted successfully');
    } catch (error) {
      console.error('Error deleting groups:', error);
    }
  } else {
    console.error('Expected params to contain an array of IDs, but got:', typeof ids);
  }
};