import { db,doc,collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
// step 1: change all collection(tables) names in 6 queries 

export const  createBrandDb = async (orgId, payload)  =>  {
    // step 2a: check what values are required by going to network call of http://admin.hellostores.com     
    // step 2b: check what values are coming from parms through console.log
    try {
      const filesCollectionRef = collection(db, `T_banners`); // step 1: change to your collection name
      const { params } = payload;
      console.log('my brand params in duplicate are ====>', params)
      const docRef = await addDoc(filesCollectionRef, {...params});
      console.log('✅ Files saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving files to Firestore:', error);
      throw error;
    }
  };





export const getAllBrands = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  let convertStatus =params?.params?.status ==='published' ? 1: 0
  const filesQuery = query(
    collection(db, `T_banners`), // change to your collection name
    where('active', '==', convertStatus),
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
          "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_banners\/paginate?page=1",
          "label": "1",
          "active": true
      },
      {
          "url": null,
          "label": "Next &raquo;",
          "active": false
      }
  ],
  "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_banners\/paginate",
  "per_page": "1000",
  "to": files.length,
  "total": files.length
}}
  return y;
};

export const getAllBrandsSnap = async (params, callback) => {
  console.log('snap are ====>', params)
    try {
    const filesQuery1 = query(
      collection(db, `T_banners`), //step 1:  change to your collection name
      where("status", "==", params?.params?.status || "published")
    );
    const itemsQuery1 = query(
      collection(db, 'T_banners'),

    )
    // return await onSnapshot(itemsQuery1, callback)
  
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(filesQuery1, (querySnapshot) => {
      const files = querySnapshot.docs.map((doc) => {
        let x = doc.data();
        x.id = doc.id;
        x.uuid = doc.id;
        return x;
      });
  
      let response = {
        data: files,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [
            { url: null, label: "&laquo; Previous", active: false },
            {
              url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_banners/paginate?page=1",
              label: "1",
              active: true,
            },
            { url: null, label: "Next &raquo;", active: false },
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_banners/paginate",
          per_page: "10",
          to: files.length,
          total: files.length,
        },
      };
  
      // Call the provided callback function with updated data
      console.log('my response is', response)
      callback(response);
    });
  
    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
  
  } catch (error) {
      console.error('Error fetching T_banners:', error);
  }
  return     
  // const {params} = params

};
export const getAllBrandsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `T_banners`, uid) // step 1: change to your collection name
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

export const updateBrand = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `T_banners`, uid), { // step 1: change to your collection name
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Failed updated T_banners', error, {
      ...params,
    })
  
  }
}
export const deleteBrand= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'T_banners', item)) // step 1: change to your collection name
  })

}