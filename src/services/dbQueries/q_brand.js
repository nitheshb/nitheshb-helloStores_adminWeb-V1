import { db,doc,collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
// step 1: change all collection(tables) names in 6 queries 

export const  createBrandDb = async (orgId, payload)  =>  {
    // step 2a: check what values are required by going to network call of http://admin.hellostores.com     
    // step 2b: check what values are coming from parms through console.log
    try {
      const filesCollectionRef = collection(db, `P_brands`); // step 1: change to your collection name
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
  const { search = '', page = 1, perPage = 10 } = params?.params || {};
  
  // Create base query
  let filesQuery = query(collection(db, `P_brands`));
  
  // Add search filter if search term exists
  if (search) {
    filesQuery = query(
      collection(db, `P_brands`),
      where('title', '>=', search),
      where('title', '<=', search + '\uf8ff')
    );
  }
  
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  // Calculate pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedFiles = files.slice(startIndex, endIndex);
  
  return {
    data: paginatedFiles,
    meta: {
      current_page: page,
      from: startIndex + 1,
      last_page: Math.ceil(files.length / perPage),
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false
        },
        {
          url: `https://api.hellostores.in/api/v1/dashboard/admin/brands/paginate?page=${page}`,
          label: page.toString(),
          active: true
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false
        }
      ],
      path: "https://api.hellostores.in/api/v1/dashboard/admin/brands/paginate",
      per_page: perPage.toString(),
      to: endIndex,
      total: files.length
    }
  };
};

export const getAllBrandsSnap = async (params, callback) => {
  console.log('snap are ====>', params)
    try {
    const filesQuery1 = query(
      collection(db, `brands`), //step 1:  change to your collection name
      where("status", "==", params?.params?.status || "published")
    );
    const itemsQuery1 = query(
      collection(db, 'brands'),

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
              url: "https://single-api.foodyman.org/api/v1/dashboard/admin/brands/paginate?page=1",
              label: "1",
              active: true,
            },
            { url: null, label: "Next &raquo;", active: false },
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/brands/paginate",
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
      console.error('Error fetching brands:', error);
  }
  return     
  // const {params} = params

};
export const getAllBrandsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `P_brands`, uid) // step 1: change to your collection name
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


    await updateDoc(doc(db, `P_brands`, uid), { // step 1: change to your collection name
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Failed updated brands', error, {
      ...params,
    })
  
  }
}
export const deleteBrand= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'P_brands', item)) // step 1: change to your collection name
  })

}


// Function to search for brands based on a search term
export const searchByBrand = async (searchTerm) => {
  try {
    console.log('Searching for brands with search term:', searchTerm);

    // Create a query to search brands based on the 'title' field (brand name) and 'active' status
    const brandsQuery = query(
      collection(db, 'P_brands'), // Adjust the collection name to match your Firebase Firestore setup
      where('title', '>=', searchTerm), // Search for brands with titles that start with the search term
      where('title', '<=', searchTerm + '\uf8ff') // Make the search case-insensitive (range search)
    );

    // Fetch the documents matching the query
    const querySnapshot = await getDocs(brandsQuery);

    // Map through the results and format the response as needed
    const brands = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uuid: doc.id,
        title: data.title,
        active: data.active,
        img: data.img,
        products_count: data.products_count,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    });

    // Return the formatted data
    return {
      data: brands,
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [
          { url: null, label: '&laquo; Previous', active: false },
          {
            url: `https://api.hellostores.in/api/v1/dashboard/admin/brands/search?search=${searchTerm}`,
            label: '1',
            active: true,
          },
          { url: null, label: 'Next &raquo;', active: false },
        ],
        path: `https://api.hellostores.in/api/v1/dashboard/admin/brands/search`,
        per_page: '10',
        to: brands.length,
        total: brands.length,
      },
    };
  } catch (error) {
    console.error('Error searching for brands:', error);
    throw error;
  }
};