import {Timestamp, db,doc,collection, query, where, setDoc, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
import { v4 as uuidv4 } from 'uuid'


export const createProductsDb = async (orgId, payload) => {
  const filesCollectionRef = collection(db, 'T-products');
  const { params } = payload;
  const uuid = uuidv4(); // UUID for the product
  const translationId = uuidv4(); // UUID for translation
  // Extract all locale data from params
  const translations = [];
  const locales = [];
  const titleData = {};
  const descriptionData = {};
  // Process all title and description fields with patterns title[locale] and description[locale]
  Object.keys(params).forEach(key => {
    const titleMatch = key.match(/^title\[(.*)\]$/);
    if (titleMatch && titleMatch[1] && params[key] !== undefined && params[key].trim() !== '') {
      const locale = titleMatch[1];
      titleData[locale] = params[key];
      translations.push({
        locale: locale,
        title: params[key],
        description: descriptionData[locale] || '', // Attach description per locale
      });
      // Add to locales array
      if (!locales.includes(locale)) {
        locales.push(locale);
      }
    }
    const descriptionMatch = key.match(/^description\[(.*)\]$/);
    if (descriptionMatch && descriptionMatch[1] && params[key] !== undefined && params[key].trim() !== '') {
      const locale = descriptionMatch[1];
      descriptionData[locale] = params[key];
      // Make sure descriptions are correctly associated in the translations array
      const translationIndex = translations.findIndex(t => t.locale === locale);
      if (translationIndex !== -1) {
        translations[translationIndex].description = params[key];
      } else {
        translations.push({
          locale: locale,
          title: titleData[locale] || '',
          description: params[key],
        });
      }
      // Add to locales array if not already present
      if (!locales.includes(locale)) {
        locales.push(locale);
      }
    }
  });
  // Default to 'en' if no locales found
  if (locales.length === 0) {
    locales.push('en');
  }
  // Use first locale as primary translation
  const primaryLocale = locales[0];
  const primaryTitle = titleData[primaryLocale] || '';
  const primaryDescription = descriptionData[primaryLocale] || '';
  // Process images
  // Extract images from params, looking for images[0], images[1], etc.
  const images = [];
  Object.keys(params).forEach(key => {
    const imageMatch = key.match(/^images\[(\d+)\]$/);
    if (imageMatch && params[key]) {
      images[parseInt(imageMatch[1])] = params[key];
    }
  });
  // Remove any undefined entries
  const cleanedImages = images.filter(img => img !== undefined);
  const imageUrl = cleanedImages.length > 0 ? cleanedImages[0] : '';
  const input = {
    uuid: uuid,  // Store uuid field separately as expected by ProductsIndex.js
    id: uuid,    // Also store as id for compatibility
    img: imageUrl,
    images: cleanedImages, // Store all images
    tax: Number(params.tax) || 0,
    interval: Number(params.interval) || 0,
    min_qty: Number(params.min_qty) || 0,
    max_qty: Number(params.max_qty) || 0,
    brand_id: params.brand_id || null,
    category_id: params.category_id || null,
    unit_id: params.unit_id || null,
    kitchen_id: params.kitchen_id || null,
    active: params.active === true || params.active === 1 ? 1 : 0,
    type: 'product',
    created_at: Timestamp.now().toMillis(),
    updated_at: Timestamp.now().toMillis(),
    title: titleData,  // Store all titles by locale
    translations: translations,  // Store array of all translations
    translation: {  // Store primary translation for backward compatibility
      id: translationId,
      locale: primaryLocale,
      title: primaryTitle,
      description: primaryDescription,
    },
    locales: locales,  // Store all available locales
  };
  console.log('Creating product with data:', input);
  try {
    // Use the UUID as the document ID in Firestore
    const docRef = await setDoc(doc(filesCollectionRef, uuid), input);
    console.log('Product saved successfully with UUID:', uuid);
    // Return the response in the format expected by ProductsIndex.js
    return { 
      data: {
        uuid: uuid
      }
    };
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    throw error;
  }
};

export const createStocksDb = async (productId, stocks = []) => {
  const collectionRef = collection(db, 'T_stocks');
  for (const stock of stocks) {
    const id = uuidv4();
    const docRef = doc(collectionRef, id);
    await setDoc(docRef, {
      id,
      countable_id: productId,
      sku: stock.sku,
      price: stock.price,
      quantity: stock.quantity,
      tax: stock.tax,
      total_price: stock.total_price,
      addons: stock.addons || [],
      extras: stock.extras || []
    });
  }
};




export const getAllProducts = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  let convertStatus =params?.params?.status ==='published' ? 1: 0
  const filesQuery = query(
    collection(db, `T_products`), // change to your collection name
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
          "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_products\/paginate?page=1",
          "label": "1",
          "active": true
      },
      {
          "url": null,
          "label": "Next &raquo;",
          "active": false
      }
  ],
  "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/T_products\/paginate",
  "per_page": "1000",
  "to": files.length,
  "total": files.length
}}
  return y;
};

export const getAllProductsSnap = async (params, callback) => {
  console.log('snap are ====>', params)
    try {
    const filesQuery1 = query(
      collection(db, `T_products`), //step 1:  change to your collection name
      where("status", "==", params?.params?.status || "published")
    );
    const itemsQuery1 = query(
      collection(db, 'T_products'),

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
              url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_products/paginate?page=1",
              label: "1",
              active: true,
            },
            { url: null, label: "Next &raquo;", active: false },
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_products/paginate",
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
      console.error('Error fetching T_products:', error);
  }
  return     
  // const {params} = params

};
export const getAllProductsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `T_products`, uid) // step 1: change to your collection name
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

export const updateProducts = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `T_products`, uid), { // step 1: change to your collection name
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Failed updated T_products', error, {
      ...params,
    })
  
  }
}
export const deleteProducts= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'T_products', item)) // step 1: change to your collection name
  })

}


export const ExtrasGroupsDb = async (url, params) => {
  try {
    // Assuming we're interacting with Firestore to get or manipulate extra groups
    const extrasCollectionRef = collection(db, 'T_extras_groups'); // Replace 'T_extras_groups' with the correct collection name
    const extrasQuery = query(extrasCollectionRef, where('active', '==', 1)); // Example: filtering by active status, adjust as needed
    
    const querySnapshot = await getDocs(extrasQuery);
    const extrasData = querySnapshot.docs.map((doc) => {
      let data = doc.data();
      data.id = doc.id;
      return data;
    });

    console.log('Fetched extras groups:', extrasData);
    return { data: extrasData };
  } catch (error) {
    console.error('Error fetching extras groups from Firestore:', error);
    throw error;
  }
};




