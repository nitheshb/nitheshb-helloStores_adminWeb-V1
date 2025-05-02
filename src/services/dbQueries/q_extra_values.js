import { db,doc,collection,Timestamp, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, setDoc } from 'db';
import { v4 as uuidv4 } from 'uuid'
// Fixed createValuesDb function in paste-2.txt

export const createValuesDb = async (orgId, payload) => {
  const filesCollectionRef = collection(db, 'T_extra_values');
  const { params } = payload;
  const myId = uuidv4();

  const selectedLanguage = params.selectedLanguage || 'en';
  const isActive = params.active !== undefined ? params.active : true;

  // First, get the actual group data from Firestore to ensure we have accurate information
  try {
    // Assuming extra_group_id is the actual ID of the group
    const groupId = params.extra_group_id.value || params.extra_group_id;
    const groupDocRef = doc(db, 'T_extra_groups', groupId);
    const groupDoc = await getDoc(groupDocRef);
    
    let groupData = null;
    if (groupDoc.exists()) {
      groupData = groupDoc.data();
    } else {
      console.error('Group not found with ID:', groupId);
      throw new Error('Group not found');
    }

    // Create the input object with proper group structure
    const input = {
      id: myId,
      extra_group_id: Number(groupId) || groupId, // Convert to number if possible
      value: params.value || "",
      active: isActive,
      group: {
        id: groupData.id || groupId,
        type: groupData.type || "text",
        active: groupData.active || true,
        translation: groupData.translation || {
          id: groupData.id || groupId,
          locale: selectedLanguage,
          title: params.extra_group_id.label || groupData.translation?.title || ""
        },
        shop: groupData.shop || null
      }
    };

    console.log('Prepared Firestore input:', input);

    const docRef = await addDoc(filesCollectionRef, input);
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error writing document: ', error);
    throw error;
  }
};

// Fixed getAllValues function in paste-2.txt

export const getAllValues = async (orgId, params) => {
  console.log('params are ====>', params)
  
  const filesQuery = query(
    collection(db, `T_extra_values`),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = await Promise.all(querySnapshot.docs.map(async (doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    
    // If group data is missing or incomplete, try to fetch it
    if (!x.group || !x.group.translation || !x.group.translation.title) {
      try {
        // Get group data if we have the ID
        if (x.extra_group_id) {
          const groupId = typeof x.extra_group_id === 'object' ? x.extra_group_id.value : x.extra_group_id;
          const groupDocRef = doc(db, 'T_extra_groups', String(groupId));
          const groupDoc = await getDoc(groupDocRef);
          
          if (groupDoc.exists()) {
            const groupData = groupDoc.data();
            x.group = {
              id: groupData.id || groupId,
              type: groupData.type || "text",
              active: groupData.active || true,
              translation: groupData.translation || {
                id: groupData.id || groupId,
                locale: "en",
                title: groupData.title || ""
              },
              shop: groupData.shop || null
            };
          }
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    }
    
    return x;
  }));
  
  console.log('my files are ====>', files);
  
  let y = {
    data: files, 
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
          "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_extra_values\/paginate?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": null,
          "label": "Next &raquo;",
          "active": false
        }
      ],
      "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_extra_values\/paginate",
      "per_page": "1000",
      "to": files.length,
      "total": files.length
    }
  };
  
  return y;
};

// Fixed getAllValuesSnap function in paste-2.txt

export const getAllValuesSnap = async (params, callback) => {
  console.log('snap are ====>', params)
  try {
    const filesQuery1 = query(
      collection(db, `T_extra_values`),
      where("status", "==", params?.params?.status || "published")
    );
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(filesQuery1, async (querySnapshot) => {
      // Process all documents with proper group information
      const filesPromises = querySnapshot.docs.map(async (doc) => {
        let x = doc.data();
        x.id = doc.id;
        x.uuid = doc.id;
        
        // If group data is incomplete, try to fetch it
        if (!x.group || !x.group.translation || !x.group.translation.title) {
          try {
            // Get group data if we have the ID
            if (x.extra_group_id) {
              const groupId = typeof x.extra_group_id === 'object' ? x.extra_group_id.value : x.extra_group_id;
              const groupDocRef = doc(db, 'T_extra_groups', String(groupId));
              const groupDoc = await getDoc(groupDocRef);
              
              if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                x.group = {
                  id: groupData.id || groupId,
                  type: groupData.type || "text",
                  active: groupData.active || true,
                  translation: groupData.translation || {
                    id: groupData.id || groupId,
                    locale: "en",
                    title: groupData.title || ""
                  },
                  shop: groupData.shop || null
                };
              }
            }
          } catch (error) {
            console.error('Error fetching group data:', error);
          }
        }
        
        return x;
      });
      
      // Wait for all group data to be fetched
      const files = await Promise.all(filesPromises);
  
      let response = {
        data: files,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [
            { url: null, label: "&laquo; Previous", active: false },
            {
              url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_extra_values/paginate?page=1",
              label: "1",
              active: true,
            },
            { url: null, label: "Next &raquo;", active: false },
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_extra_values/paginate",
          per_page: "10",
          to: files.length,
          total: files.length,
        },
      };
  
      // Call the provided callback function with updated data
      console.log('my response is', response);
      callback(response);
    });
  
    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
  
  } catch (error) {
    console.error('Error fetching T_extra_values:', error);
    return null;
  }
};

export const getAllValuesById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `T_extra_values`, uid) // step 1: change to your collection name
    const docSnap = await getDoc(docRef)

    console.log('Document data:', docSnap.data());

    if (docSnap.exists() && docSnap.data()) {
      console.log('Brokerage details found:', docSnap.data());
      let x =docSnap.data();
      x.id = docSnap.id;
      x.uuid = doc.id;
      x.img = x['images[0]'];

      return docSnap.data();
    } else {
      console.log('No brokerage details found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching brokerage details:', error);
    throw error;
  }
};


export const updateValues = async (uid, params) => {
  try {
    console.log('params are ====>', uid, params);
    
    // Create update object with only defined fields
    const updateData = {};
    
    // Only add fields that exist and are not undefined
    if (params.title !== undefined) updateData.title = params.title;
    if (params.active !== undefined) updateData.active = params.active;
    
    // Ensure value is explicitly set, even if it's an empty string
    updateData.value = params.value === undefined ? "" : params.value;
    
    // Handle group data update if present
    if (params.extra_group_id !== undefined) {
      // First, fetch the current group data to ensure we have accurate information
      try {
        const groupId = typeof params.extra_group_id === 'object' 
          ? params.extra_group_id.value 
          : params.extra_group_id;
        
        const groupDocRef = doc(db, 'T_extra_groups', String(groupId));
        const groupDoc = await getDoc(groupDocRef);
        
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          updateData.extra_group_id = groupId;
          updateData.group = {
            id: groupData.id || groupId,
            type: groupData.type || "text",
            active: groupData.active !== undefined ? groupData.active : true,
            translation: groupData.translation || {
              id: groupData.id || groupId,
              locale: params.selectedLanguage || "en",
              title: params.extra_group_id.label || groupData.translation?.title || ""
            },
            shop: groupData.shop || null
          };
        } else {
          console.error('Group not found with ID:', groupId);
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    }
    
    console.log('Updating with data:', updateData);
    
    // Update the document with only valid fields
    await updateDoc(doc(db, `T_extra_values`, uid), updateData);
    
    console.log('Successfully updated T_extra_values with data:', updateData);
    
  } catch (error) {
    console.log('Failed updated T_extra_values', error, {
      ...params,
    });
    throw error; // Re-throw the error so it can be handled by the caller
  }
}


export const deleteValues = async (params) => {
  console.log('delete user is ', params);
 
  const ids = Object.values(params);
 
  if (Array.isArray(ids)) {
    try {
      await Promise.all(
        ids.map(async (item) => {
          await deleteDoc(doc(db, 'T_extra_values', item)); 
        })
      );
      console.log('All Values deleted successfully');
    } catch (error) {
      console.error('Error deleting bValues:', error);
    }
  } else {
    console.error('Expected params to contain an array of IDs, but got:', typeof ids);
  }
};