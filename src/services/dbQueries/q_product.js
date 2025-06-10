import {Timestamp, db,doc,collection, query, where, setDoc, getDocs, updateDoc, deleteDoc, getDoc, onSnapshot } from 'db';
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
    is_show_in_homescreen: params.is_show_in_homescreen === true || params.is_show_in_homescreen === 1 ? true : false,
    show_in: params.show_in || [],
    status: params.status && isValidStatus(params.status) ? params.status : PRODUCT_STATUS.PENDING,
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
      const selling_price = Number(stock.selling_price || price); // Use price as fallback if selling_price not provided
      const total_price = tax === 0 ? price : (price * tax) / 100 + price;
      
      // Process extras - extract IDs from the form data
      const extrasIds = [];
      if (stock.extras && Array.isArray(stock.extras)) {
        // If extras is already an array of IDs
        extrasIds.push(...stock.extras);
      } else if (stock.ids && Array.isArray(stock.ids)) {
        // If extras are in the 'ids' field
        extrasIds.push(...stock.ids);
      } else {
        // Check for extras in the format extras[0], extras[1], etc.
        Object.keys(stock).forEach(key => {
          const extrasMatch = key.match(/^extras\[(\d+)\]$/);
          if (extrasMatch && stock[key]) {
            extrasIds.push(stock[key]);
          }
        });
      }
      
      const stockData = {
        id,
        countable_id: productId,
        sku: stock.sku || '',
        price: price,
        selling_price: selling_price,
        quantity: Number(stock.quantity),
        tax: tax,
        total_price: total_price,
        addon: stock.addon || false,
        addons: stock.addons || [],
        extras: extrasIds, // Store as array of extra value IDs
        bonus: stock.bonus || null,
        created_at: Timestamp.now().toMillis(),
        updated_at: Timestamp.now().toMillis()
      };
      
      console.log('Saving stock data:', stockData);
      await setDoc(docRef, stockData);
      await updateProducts(productId, { price, selling_price });
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
  // Extract params from the nested structure
  const filterParams = params?.params || {};

  // Build query constraints array
  const constraints = [];
  
  // Add filters to constraints array only if they have actual values
  if (filterParams.category_id && filterParams.category_id !== 'undefined' && filterParams.category_id !== '') {
    constraints.push(where('category_id', '==', filterParams.category_id));
  }
  
  if (filterParams.brand_id && filterParams.brand_id !== 'undefined' && filterParams.brand_id !== '') {
    constraints.push(where('brand_id', '==', filterParams.brand_id));
  }
  
  if (filterParams.shop_id && filterParams.shop_id !== 'undefined' && filterParams.shop_id !== '') {
    constraints.push(where('shop_id', '==', filterParams.shop_id));
  }
  
  if (filterParams.status && filterParams.status !== 'undefined' && filterParams.status !== '') {
    constraints.push(where('status', '==', filterParams.status));
  }

  try {
    // Create the query with all constraints
    const productsQuery = query(
      collection(db, 'T_products'),
      ...constraints
    );

    const querySnapshot = await getDocs(productsQuery);

    if (querySnapshot.empty) {
      return {
        data: [],
        meta: {
          current_page: 1,
          from: 0,
          last_page: 1,
          to: 0,
          total: 0,
        },
      };
    }

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
        console.warn(`Failed to fetch ${collectionName}/${id}`);
      }
      return { id, translation: { title: fallback } };
    };

    let files = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        // Fetch additional information for category, brand, and shop
        const [category, brand, kitchen] = await Promise.all([
          getTranslation('p_category', data.category_id, 'N/A'),
          getTranslation('brands', data.brand_id, 'N/A'),
          getTranslation('kitchen', data.kitchen_id, 'N/A'),
        ]);

        const shopId = String(data.shop_id);
        const shop = hardcodedShops[shopId] || { translation: { title: 'Noma Haus' } };

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

        return {
          ...data,
          id: docSnap.id,
          uuid: docSnap.id,
          category,
          brand,
          shop,
          kitchen,
          stocks,
          reviews: data.reviews || [],
          translations: data.translations || [{ locale: 'en', title: data.translation?.title || 'N/A' }],
          locales: data.locales || ['en'],
          shopTitle: shop.translation?.title || 'N/A',
        };
      })
    );

    // Sort the results in memory after fetching
    files.sort((a, b) => b.created_at - a.created_at);

    // Apply search filter if search parameter exists and has a value
    if (filterParams.search && filterParams.search !== 'undefined' && filterParams.search !== '') {
      const searchTerm = filterParams.search.toLowerCase();
      files = files.filter(product => {
        // Search in translations
        const translationMatch = product.translations?.some(trans => 
          trans.title?.toLowerCase().includes(searchTerm) || 
          trans.description?.toLowerCase().includes(searchTerm)
        );
        
        // Search in title object
        const titleMatch = Object.values(product.title || {}).some(title => 
          title.toLowerCase().includes(searchTerm)
        );
        
        // Search in other fields
        const otherFieldsMatch = 
          product.sku?.toLowerCase().includes(searchTerm) ||
          product.shopTitle?.toLowerCase().includes(searchTerm);
        
        return translationMatch || titleMatch || otherFieldsMatch;
      });
    }

    return {
      data: files,
      meta: {
        current_page: 1,
        from: files.length > 0 ? 1 : 0,
        last_page: 1,
        to: files.length,
        total: files.length,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


export const getAllProductsById = async (orgId, uid, params = {}) => {
  try {
    console.log('Fetching product by ID:', uid);

    const docRef = doc(db, 'T_products', uid);
    const docSnap = await getDoc(docRef);
   
    // Fetch stocks for this product
    const filesQuery = query(
      collection(db, `T_stocks`),
      where('countable_id','==',uid)
    );

    const querySnapshot = await getDocs(filesQuery);
    let stocks = [];
    
    console.log("stocksData", querySnapshot.docs);
    
    // Process each stock document
    for (const stockDoc of querySnapshot.docs) {
      let stockData = stockDoc.data();
      stockData.id = stockDoc.id; 
      stockData.uuid = stockDoc.id;
      
      // Process extras for this stock
      if (stockData.extras && Array.isArray(stockData.extras)) {
        const processedExtras = [];
        
        for (const extraId of stockData.extras) {
          try {
            // Fetch the extra value document
            const extraValueRef = doc(db, 'T_extra_values', String(extraId));
            const extraValueSnap = await getDoc(extraValueRef);
            
            if (extraValueSnap.exists()) {
              const extraValueData = extraValueSnap.data();
              
              // Fetch the group data for this extra value
              let groupData = null;
              if (extraValueData.extra_group_id) {
                const groupRef = doc(db, 'T_extra_groups', String(extraValueData.extra_group_id));
                const groupSnap = await getDoc(groupRef);
                
                if (groupSnap.exists()) {
                  groupData = groupSnap.data();
                }
              }
              
              // Structure the extra data to match the expected JSON format
              const extraItem = {
                id: extraValueSnap.id,
                extra_group_id: extraValueData.extra_group_id,
                value: extraValueData.value || '',
                active: extraValueData.active !== undefined ? extraValueData.active : true,
                group: groupData ? {
                  id: groupData.id || extraValueData.extra_group_id,
                  type: groupData.type || 'text',
                  active: groupData.active !== undefined ? groupData.active : true,
                  translation: groupData.translation || {
                    id: groupData.id || extraValueData.extra_group_id,
                    locale: 'en',
                    title: groupData.title || 'Unknown Group'
                  }
                } : null
              };
              
              processedExtras.push(extraItem);
            }
          } catch (error) {
            console.error('Error fetching extra data for ID:', extraId, error);
          }
        }
        
        stockData.extras = processedExtras;
      } else {
        stockData.extras = [];
      }
      
      stocks.push(stockData);
    }

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
      const shop = hardcodedShops[data.shop_id] || { translation: { title: 'Noma Haus' } };

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
        stocks: stocks // Use the processed stocks with proper extras
      };

      console.log('formattedProduct', formattedProduct)
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


export const updateProducts = async (uid, params) => {
  try {
    console.log('Updating product with ID:', uid, 'params:', params);
    
    // First, get the existing product data to preserve existing translations
    const docRef = doc(db, 'T_products', uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Product with ID ${uid} not found`);
    }
    
    const existingData = docSnap.data();
    
    // Process translations similar to createProductsDb
    const translations = [...(existingData.translations || [])];
    const locales = [...(existingData.locales || ['en'])];
    const titleData = { ...(existingData.title || {}) };
    const descriptionData = {};
    
    // Extract existing descriptions from translations
    existingData.translations?.forEach(trans => {
      if (trans.description) {
        descriptionData[trans.locale] = trans.description;
      }
    });
    
    // Process new title and description fields with patterns title[locale] and description[locale]
    Object.keys(params).forEach(key => {
      const titleMatch = key.match(/^title\[(.*)\]$/);
      if (titleMatch && titleMatch[1] && params[key] !== undefined && params[key].trim() !== '') {
        const locale = titleMatch[1];
        titleData[locale] = params[key];
        
        // Update or add translation for this locale
        const translationIndex = translations.findIndex(t => t.locale === locale);
        if (translationIndex !== -1) {
          translations[translationIndex].title = params[key];
        } else {
          translations.push({
            locale: locale,
            title: params[key],
            description: descriptionData[locale] || '',
          });
        }
        
        // Add to locales array if not present
        if (!locales.includes(locale)) {
          locales.push(locale);
        }
      }
      
      const descriptionMatch = key.match(/^description\[(.*)\]$/);
      if (descriptionMatch && descriptionMatch[1] && params[key] !== undefined && params[key].trim() !== '') {
        const locale = descriptionMatch[1];
        descriptionData[locale] = params[key];
        
        // Update or add description to existing translation
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
        
        // Add to locales array if not present
        if (!locales.includes(locale)) {
          locales.push(locale);
        }
      }
    });
    
    // Process images similar to createProductsDb
    const images = [];
    let hasNewImages = false;
    Object.keys(params).forEach(key => {
      const imageMatch = key.match(/^images\[(\d+)\]$/);
      if (imageMatch && params[key]) {
        images[parseInt(imageMatch[1])] = params[key];
        hasNewImages = true;
      }
    });
    
    // Clean up images array and get primary image
    const cleanedImages = images.filter(img => img !== undefined);
    const imageUrl = cleanedImages.length > 0 ? cleanedImages[0] : existingData.img;
    
    // Use first locale as primary translation
    const primaryLocale = locales[0];
    const primaryTitle = titleData[primaryLocale] || existingData.translation?.title || '';
    const primaryDescription = descriptionData[primaryLocale] || existingData.translation?.description || '';
    
    // Build update data
    const updateData = {
      updated_at: Timestamp.now().toMillis(),
    };
    
    // Add non-translation fields
    if (params.tax !== undefined) updateData.tax = Number(params.tax) || 0;
    if (params.interval !== undefined) updateData.interval = Number(params.interval) || 0;
    if (params.min_qty !== undefined) updateData.min_qty = Number(params.min_qty) || 0;
    if (params.max_qty !== undefined) updateData.max_qty = Number(params.max_qty) || 0;
    if (params.brand_id !== undefined) updateData.brand_id = params.brand_id || null;
    if (params.category_id !== undefined) updateData.category_id = params.category_id || null;
    if (params.unit_id !== undefined) updateData.unit_id = params.unit_id || null;
    if (params.kitchen_id !== undefined) updateData.kitchen_id = params.kitchen_id || null;
    if (params.active !== undefined) updateData.active = params.active === true || params.active === 1 ? 1 : 0;
    if (params.is_show_in_homescreen !== undefined) updateData.is_show_in_homescreen = params.is_show_in_homescreen === true || params.is_show_in_homescreen === 1 ? true : false;
    if (params.show_in !== undefined) updateData.show_in = params.show_in || [];
    if (params.price !== undefined) updateData.price = Number(params.price) || 0;
    if (params.selling_price !== undefined) updateData.selling_price = Number(params.selling_price) || 0;
    
     // Handle status with enum validation
    if (params.status !== undefined) {
      if (isValidStatus(params.status)) {
        updateData.status = params.status;
      } else {
        console.warn(`Invalid status provided: ${params.status}. Keeping existing status.`);
      }
    } else {
      // Set default status to PENDING when updating other fields
      updateData.status = PRODUCT_STATUS.PENDING;
    }
    
    // Add translation fields if they were updated
    if (Object.keys(titleData).length > 0) {
      updateData.title = titleData;
      updateData.translations = translations;
      updateData.locales = locales;
      updateData.translation = {
        id: existingData.translation?.id || uuidv4(),
        locale: primaryLocale,
        title: primaryTitle,
        description: primaryDescription,
      };
    }
    
    // Add image fields if they were updated
    if (hasNewImages) {
      updateData.img = imageUrl;
      updateData.images = cleanedImages;
    }
    
    // updateData.status = "pending";

   

    // Clean the data to replace undefined values
    const cleanedData = replaceUndefined(updateData);
    
    console.log('Updating product with data:', cleanedData);
    
    await updateDoc(docRef, cleanedData);
    
    console.log("Successfully updated product:", uid);
    
    return { 
      success: true, 
      message: 'Product updated successfully',
      data: { uuid: uid }
    };
    
  } catch (error) {
    console.error('Failed to update product:', error, { uid, params });
    throw error;
  }
};

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


export const setActiveProducts = async (id) => {
    try {
        // Extract the actual ID from the path if needed
        const productId = id.includes('/') ? id.split('/').pop() : id;

        // Get the current document data
        const docRef = doc(db, 'T_products', productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        // Get current data and toggle the active status
        const productData = docSnap.data();
        const currentActive = productData.active === 1 || productData.active === true;
        const newActive = !currentActive;

        // Update the document with the toggled active status
        await updateDoc(docRef, {
            active: newActive ? 1 : 0,
            updated_at: Timestamp.now().toMillis()
        });

        // Prepare and return the response in the expected format
        const response = {
            timestamp: new Date().toISOString(),
            status: true,
            data: {
                id: parseInt(productId) || productId, // Try to parse as integer if possible
                active: newActive,
                position: productData.position || "before",
                "created_at": Timestamp.now().toMillis(),
                "updated_at": Timestamp.now().toMillis(),
                locales: productData.locales || ["en"]
            }
        };

        console.log('Product active status toggled successfully:', response);
        return response;
    } catch (error) {
        console.error('Error toggling product active status:', error);
        throw error;
    }
};

export const setShowInHomescreenProducts = async (id) => {
    try {
        // Extract the actual ID from the path if needed
        const productId = id.includes('/') ? id.split('/').pop() : id;

        // Get the current document data
        const docRef = doc(db, 'T_products', productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        // Get current data and toggle the is_show_in_homescreen status
        const productData = docSnap.data();
        const currentShowInHomescreen = productData.is_show_in_homescreen === true;
        const newShowInHomescreen = !currentShowInHomescreen;

        // Update the document with the toggled is_show_in_homescreen status
        await updateDoc(docRef, {
            is_show_in_homescreen: newShowInHomescreen,
            updated_at: Timestamp.now().toMillis()
        });

        // Prepare and return the response in the expected format
        const response = {
            timestamp: new Date().toISOString(),
            status: true,
            data: {
                id: parseInt(productId) || productId, // Try to parse as integer if possible
                is_show_in_homescreen: newShowInHomescreen,
                position: productData.position || "before",
                "created_at": Timestamp.now().toMillis(),
                "updated_at": Timestamp.now().toMillis(),
                locales: productData.locales || ["en"]
            }
        };

        console.log('Product show in homescreen status toggled successfully:', response);
        return response;
    } catch (error) {
        console.error('Error toggling product show in homescreen status:', error);
        throw error;
    }
};

export const PRODUCT_STATUS = {
  PENDING: 'pending',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished'
};

// Function to validate status enum
const isValidStatus = (status) => {
  return Object.values(PRODUCT_STATUS).includes(status);
};

// New function to update product status independently
export const updateProductStatus = async (uuid, status) => {
  try {
    console.log('Updating product status:', { uuid, status });
    
    // Validate status enum
    if (!isValidStatus(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${Object.values(PRODUCT_STATUS).join(', ')}`);
    }
    
    // Check if product exists
    const docRef = doc(db, 'T_products', uuid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Product with UUID ${uuid} not found`);
    }
    
    // Update only the status field
    const updateData = {
      status: status,
      updated_at: Timestamp.now().toMillis()
    };
    
    await updateDoc(docRef, updateData);
    
    console.log(`Product status updated successfully: ${uuid} -> ${status}`);
    
    // Return response in the expected format
    return {
      timestamp: new Date().toISOString(),
      status: true,
      message: "web.record_has_been_successfully_updated",
      data: {
        uuid: uuid,
        status: status,
        updated_at: updateData.updated_at
      }
    };
    
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};
