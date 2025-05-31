import {Timestamp, db,doc,collection, query, where, setDoc, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, orderBy } from 'db';
import { v4 as uuidv4 } from 'uuid'


export const createProductsDb = async (orgId, payload) => {
  const filesCollectionRef = collection(db, 'T_products');
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

export const createStocksDb = async (productId, data) => {
  console.log('createStocksDb called with:', { productId, data });
  const collectionRef = collection(db, 'T_stocks');
  
  // Handle the data structure from the form
  const { extras, delete_ids } = data;
  console.log('Extracted data:', { extras, delete_ids });
  
  // Validate stocks data
  if (!extras || !Array.isArray(extras) || extras.length === 0) {
    console.error('Invalid stocks data:', extras);
    throw new Error('No stocks data provided');
  }

  try {
    // First handle any deletions if needed
    if (delete_ids && Array.isArray(delete_ids)) {
      console.log('Processing deletions for IDs:', delete_ids);
      for (const id of delete_ids) {
        console.log('Deleting stock with ID:', id);
        await deleteDoc(doc(collectionRef, id));
        console.log('Successfully deleted stock:', id);
      }
    }

    // Then create/update stocks
    console.log('Processing stocks creation/update');
    for (const stock of extras) {
      console.log('Processing stock:', stock);
      
      // Validate required fields
      if (typeof stock.price === 'undefined' || typeof stock.quantity === 'undefined') {
        console.error('Missing required fields in stock:', stock);
        throw new Error('Stock must have price and quantity');
      }

      const id = stock.stock_id || uuidv4();
      console.log('Using stock ID:', id);
      
      const docRef = doc(collectionRef, id);
      
      // Calculate total_price
      const tax = Number(stock.tax || 0);
      const price = Number(stock.price);
      const total_price = tax === 0 ? price : (price * tax) / 100 + price;
      
      const stockData = {
        id,
        countable_id: productId,
        sku: stock.sku || '',
        price: price,
        quantity: Number(stock.quantity),
        tax: tax,
        total_price: total_price,
        addons: stock.addons || [],
        extras: stock.ids || [],
        created_at: Timestamp.now().toMillis(),
        updated_at: Timestamp.now().toMillis()
      };
      
      console.log('Saving stock data:', stockData);
      await setDoc(docRef, stockData);
      await updateProducts(productId,{price})
      console.log('Successfully saved stock:', id);
    }
    
    console.log('All stocks processed successfully');
    return { success: true, message: 'Stocks created successfully' };
  } catch (error) {
    console.error('Error in createStocksDb:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      data: { productId, extras, delete_ids }
    });
    throw error;
  }
};

const hardcodedShops = {
  501: {
    id: 501,
    tax: null,
    open: false,
    visibility: null,
    status: 'approved',
    invite_link: '/shop/invitation//link',
    products_count: 0,
    translation: {
      id: 6,
      locale: 'en',
      title: 'Hellostores',
    },
    locales: [],
  },
};

export const getAllProducts = async (orgId, params) => {
  const productsQuery = query(
    collection(db, 'T_products'),
    orderBy('created_at', 'desc')
  );

  const querySnapshot = await getDocs(productsQuery);

  // Helper function to get translation
  const getTranslation = async (collectionName, id, fallback) => {
    if (!id) return { id, translation: { title: fallback } };
    try {
      const ref = doc(db, collectionName, String(id));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        return {
          id,
          ...data,
          translation: data.translation || { title: fallback },
        };
      }
    } catch (e) {
      console.warn(`Failed to fetch ${collectionName}/${id}`, e);
    }
    return { id, translation: { title: fallback } };
  };

  const files = await Promise.all(
    querySnapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();

      // Fetch additional information for category, brand, and shop
      const [category, brand, kitchen] = await Promise.all([
        getTranslation('p_category', data.category_id, 'N/A'),
        getTranslation('brands', data.brand_id, 'N/A'),
        getTranslation('kitchen', data.kitchen_id, 'N/A'), // Assuming kitchen exists in the DB
      ]);

      const shopId = String(data.shop_id); // Convert to string
      // Get the shop data from the hardcoded mapping
      const shop = hardcodedShops[shopId] || { translation: { title: 'Unknown Shop' } };

      // Fetch stocks, addons, and extras
      const stocks = await Promise.all(
        (data.stocks || []).map(async (stock) => {
          const addons = await Promise.all(
            (stock.addons || []).map(async (addon) => {
              const product = addon.product ? await getTranslation('T_products', addon.product.id, 'N/A') : null;
              return {
                ...addon,
                product,
              };
            })
          );

          const extras = await Promise.all(
            (stock.extras || []).map(async (extra) => {
              const group = extra.group ? await getTranslation('extra_group', extra.group.id, 'N/A') : null;
              return {
                ...extra,
                group,
              };
            })
          );

          return {
            ...stock,
            addons,
            extras,
          };
        })
      );

      // Return final product data
      return {
        ...data,
        id: docSnap.id,
        uuid: docSnap.id, // Assuming uuid is the same as id in this case
        category,
        brand,
        shop,
        kitchen,
        stocks,
        reviews: data.reviews || [], // If reviews exist
        translations: data.translations || [{ locale: 'en', title: data.translation?.title || 'N/A' }],
        locales: data.locales || ['en'],
        shopTitle: shop.translation?.title || 'N/A',
      };
    })
  );

  return {
    data: files,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      to: files.length,
      total: files.length,
    },
  };
};


export const getAllProductsById = async (orgId, uid, params = {}) => {
  try {
    console.log('Fetching product by ID:', uid);

    const docRef = doc(db, 'T_products', uid);
    const docSnap = await getDoc(docRef);
   
    const filesQuery = query(
    collection(db, `T_stocks`), // change to your collection name
    where('countable_id','==',uid),  );

  const querySnapshot = await getDocs(filesQuery);
  let stocks = []
  console.log("stocksData",querySnapshot.docs)
  const files = querySnapshot.docs.map((doc) => {
      console.log("stocksData",doc)

    let x = doc.data();
    stocks.push(x);
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
    if (docSnap.exists() && docSnap.data()) {
      const data = docSnap.data();
      console.log('Product found:', data);

      const defaultLocale = data.locales?.[0] || 'en';

      // Safe fallback for nested documents
      const getDocWithTranslation = async (collectionName, id, fallbackTitle) => {
        if (!id) return null;
        try {
          const ref = doc(db, collectionName, String(id));
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const docData = snap.data();
            return {
              id,
              ...docData,
              translation: docData.translation || {
                locale: defaultLocale,
                title: docData.title || fallbackTitle
              }
            };
          } else {
            console.log(`No data found for ${collectionName} with ID: ${id}`);
          }
        } catch (error) {
          console.warn(`Failed to fetch ${collectionName}/${id}:`, error);
        }
        return {
          id,
          translation: {
            locale: defaultLocale,
            title: fallbackTitle
          }
        };
      };

      // Look up related references
      const [category, brand, unit, kitchen, extras] = await Promise.all([
        getDocWithTranslation('p_category', data.category_id, 'Uncategorized'),
        getDocWithTranslation('P_brands', data.brand_id, 'No brand'),
        getDocWithTranslation('T_unit', data.unit_id, 'Unit'),
        getDocWithTranslation('T_kitchen', data.kitchen_id, 'Kitchen'),
        getDocWithTranslation('T_extra_groups', data.extra_id, 'Extra'),

      ]);

      // Get the shop data from the hardcoded mapping
      const shop = hardcodedShops[data.shop_id] || { translation: { title: 'Unknown Shop' } };

      const galleries = [];
      if (data.img) {
        galleries.push({
          id: data.galleries?.[0]?.id || Math.floor(Math.random() * 100) + 1,
          title: data.img.split('/').pop() || '',
          type: 'products',
          loadable_type: 'App\\Models\\Product',
          loadable_id: data.id || uid,
          path: data.img,
          base_path: 'api.hellostores.in/storage/images/'
        });
      }

      const formattedProduct = {
        ...data,
        id: data.id || uid,
        uuid: uid,
        translation: data.translation || {
          id: uuidv4(),
          locale: defaultLocale,
          title: '',
          description: ''
        },
        translations: data.translations || [
          {
            id: data.translation?.id || uuidv4(),
            locale: data.translation?.locale || defaultLocale,
            title: data.translation?.title || '',
            description: data.translation?.description || ''
          }
        ],
        locales: data.locales || [defaultLocale],
        properties: data.properties || [],
        galleries,
        category,
        brand,
        unit,
        kitchen,
        shop,
        extras,
        stocks:stocks
      };

      return { data: formattedProduct };
    } else {
      console.log('No product found with ID:', uid);
      return { data: null };
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
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


export const updateProducts = async (
  uid,params

) => {
  const cleanedData = replaceUndefined(params);
  try {
  
console.log('params are ====>', uid,params)
let x = params


    await updateDoc(doc(db, `T_products`, uid), { // step 1: change to your collection name
    ...cleanedData,
    status: "pending"

    })
    console.log("successfully updated", cleanedData)
  } catch (error) {
    console.log('Failed updated T_products', error, {
      ...cleanedData,
    })
  
  }
}


export const deleteProducts = async (params) => {
    console.log('delete Product is ', params);

    const ids = Object.values(params);

    if (Array.isArray(ids)) {
        try {
            await Promise.all(
                ids.map(async (item) => {
                    await deleteDoc(doc(db, 'T_products', item));
                })
            );
            console.log('All products deleted successfully');
        } catch (error) {
            console.error('Error deleting products:', error);
        }
    } else {
        console.error('Expected params to contain an array of IDs, but got:', typeof ids);
    }
};

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



function replaceUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(replaceUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, replaceUndefined(value)])
    );
  } else if (typeof obj === 'undefined') {
    return '';
  } else {
    return obj;
  }
}