import { db, doc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, Timestamp } from 'db';
import { v4 as uuidv4 } from 'uuid';
import { getAllProductsById } from 'firebase.js';

export const createDiscountsDb = async (orgId, payload) => {
  try {
    const filesCollectionRef = collection(db, `T_discount`);
    const { params } = payload;
    const did = uuidv4();

    // Store all products from params without filtering
    const products = params.products || [];

    if (products.length === 0) {
      throw new Error('No products provided');
    }

    // Initialize variables to store the shop_id and product details
    let shopId = null;
    let productsDetail = [];

    // Validate and fetch product details for each product in the products array
    console.log('Fetching product details...');
    try {
      productsDetail = await Promise.all(
        products.map(async (productId) => {
          console.log('Processing product ID:', productId);  // Log each product being processed
          if (typeof productId === 'string' || typeof productId === 'number') {
            try {
              const productDetails = await getAllProductsById(orgId, productId);
              return productDetails ? { ...productDetails, id: productId } : null;
            } catch (error) {
              console.error('Error fetching product with ID:', productId, error);
              return null;  // Skip product if error occurs
            }
          } else {
            console.warn('Invalid product ID (not string or number):', productId);
            return null;  // Skip invalid product IDs
          }
        })
      );
    } catch (error) {
      console.error('Error fetching product details:', error);
      productsDetail = [];  // If there's an error, set productsDetail to empty
    }

    // Log the fetched product details
    console.log('Fetched product details:', productsDetail);

    // Extract shop_id from the first valid product (if available)
    if (productsDetail.length > 0) {
      const firstProduct = productsDetail[0];
      shopId = firstProduct ? firstProduct.shop_id : null;
    }

    // Prepare the document data
    let input = {
      "id": did,
      "products": products,  // Store all products exactly as provided
      "type": params.type,
      "price": params.price,
      "start": params.start,
      "end": params.end,
      "shop_id": shopId,  // Add the extracted shop_id (or null if error occurs)
      "active": true,
      "created_at": Timestamp.now().toMillis(),
      "updated_at": Timestamp.now().toMillis()
    };

    // Log the input data before saving to Firestore
    console.log('My discount params in duplicate are ====>', params, input);

    // Add the document to Firestore
    const docRef = await addDoc(filesCollectionRef, input);
    console.log('✅ Files saved successfully with ID:', docRef.id);

    // Return the document ID
    return docRef.id;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};



export const getAllDiscounts = async (orgId, params) => {
  console.log('params are ====>', params);
  let convertStatus = params?.params?.status === 'published' ? 1 : 0;
  const filesQuery = query(
    collection(db, `T_discount`),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id;
    x.uuid = doc.id;
    return x;
  });

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
          "url": "https://single-api.foodyman.org/api/v1/dashboard/admin/T_discount/paginate?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": null,
          "label": "Next &raquo;",
          "active": false
        }
      ],
      "path": "https://single-api.foodyman.org/api/v1/dashboard/admin/T_discount/paginate",
      "per_page": "1000",
      "to": files.length,
      "total": files.length
    }
  };
  return y;
};

export const getAllDiscountsSnap = async (params, callback) => {
  console.log('snap are ====>', params);
  try {
    const filesQuery1 = query(
      collection(db, `T_discount`),
      where("status", "==", params?.params?.status || "published")
    );

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
            { url: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_discount/paginate?page=1", label: "1", active: true },
            { url: null, label: "Next &raquo;", active: false }
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/T_discount/paginate",
          per_page: "10",
          to: files.length,
          total: files.length
        },
      };

      // Call the provided callback function with updated data
      console.log('my response is', response);
      callback(response);
    });

    return unsubscribe;

  } catch (error) {
    console.error('Error fetching T_discount:', error);
  }
};

export const getAllDiscountsById = async (orgId, uid) => {
  try {
    console.log('Fetching discount by ID:', uid);
    const docRef = doc(db, `T_discount`, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data()) {
      const data = docSnap.data();
      console.log('Banner found:', data);

      let productsDetail = [];
      if (Array.isArray(data.products) && data.products.length > 0) {
        console.log('Found products in banner:', data.products);

        productsDetail = await Promise.all(
          data.products.map(async (productId) => {
            console.log('Processing product ID:', productId);

            if (typeof productId === 'string' || typeof productId === 'number') {
              try {
                console.log('Fetching product details for ID:', productId);
                const product = await getAllProductsById(orgId, productId);
                return product ? { ...product, id: productId } : null;
              } catch (error) {
                console.error('Error fetching product with ID:', productId, error);
                return null;
              }
            } else {
              console.warn('Invalid product ID (not string or number):', productId);
              return null;
            }
          })
        );
      }

      const formattedBanner = {
        id: data.id || uid,
        active: data.active,
        type: data.type,
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        // shop_id: data.products[0],  
        price: data.price,
        start: data.start,
        end: data.end,
        products: productsDetail,
      };

      return { data: formattedBanner };
    } else {
      console.log('No banner found with ID:', uid);
      return { data: null };
    }
  } catch (error) {
    console.error('Error fetching banner by ID:', error);
    throw error;
  }
};


export const updateDiscounts = async (uid, params) => {
  try {
    // Log the full params to inspect its structure
    console.log('Received params for updating discount:', params);

    // Ensure params contains products
    if (!params || !params.products) {
      throw new Error('Params is undefined or missing products');
    }

    const products = params.products || [];
    console.log('Products array:', products);  // Debugging log

    if (products.length === 0) {
      throw new Error('No products provided');
    }

    // Extract shop_id from the first product in the products array (for now, using the first product)
    let shopId = null;
    let productsDetail = [];

    // Validate and fetch product details for each product in the products array
    console.log('Fetching product details...');
    try {
      productsDetail = await Promise.all(
        products.map(async (productId) => {
          console.log('Processing product ID:', productId);  // Log each product being processed
          if (typeof productId === 'string' || typeof productId === 'number') {
            try {
              const productDetails = await getAllProductsById(params.orgId, productId);
              return productDetails ? { ...productDetails, id: productId } : null;
            } catch (error) {
              console.error('Error fetching product with ID:', productId, error);
              return null;  // Skip product if error occurs
            }
          } else {
            console.warn('Invalid product ID (not string or number):', productId);
            return null;  // Skip invalid product IDs
          }
        })
      );
    } catch (error) {
      console.error('Error fetching product details:', error);
      productsDetail = [];  // If there's an error, set productsDetail to empty
    }

    // Log the fetched products details
    console.log('Fetched product details:', productsDetail);

    // Extract shop_id from the first valid product (if available)
    if (productsDetail.length > 0) {
      const firstProduct = productsDetail[0];
      shopId = firstProduct ? firstProduct.shop_id : null;
    }

    // Prepare the document data
    const updatedDiscount = {
      "price": params.price,
      "type": params.type,
      "products": products,  // Store products exactly as provided
      "start": params.start,
      "end": params.end,
      "shop_id": shopId,  // Add the extracted shop_id (or null if error occurs)
      "active": params.active !== undefined ? params.active : true, // Default to true if undefined
      "updated_at": Timestamp.now().toMillis(), // Updated timestamp
    };

    // Ensure all required fields are present and valid before update
    if (!updatedDiscount.price || !updatedDiscount.type || !updatedDiscount.start || !updatedDiscount.end) {
      throw new Error('Missing required fields for updating discount');
    }

    // Log the updated discount object before saving to Firestore
    console.log('Updated discount data:', updatedDiscount);

    // Update the Firestore document
    const discountDocRef = doc(db, 'T_discount', uid);
    await updateDoc(discountDocRef, updatedDiscount);

    console.log('✅ Discount updated successfully with ID:', uid);
    return uid;
  } catch (error) {
    console.error('Failed updating T_discount', error);
    throw error;
  }
};


export const deleteDiscounts = async (params) => {
  console.log('delete user is ', params);
  const values = Array.isArray(params) ? params : Object.values(params);
  
  values.map(async (item) => {
    await deleteDoc(doc(db, 'T_discount', item)); 
  });
};


export const setActiveDiscounts = async (id) => {
  try {
    // Extract the actual ID from the path if needed
    const discountId = id.includes('/') ? id.split('/').pop() : id;

    // Get the current discount document data
    const docRef = doc(db, 'T_discount', discountId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Discount with ID ${discountId} not found`);
    }

    // Get current data and toggle the active status
    const discountData = docSnap.data();
    const currentActive = discountData.active === 1 || discountData.active === true;
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
        id: parseInt(discountId) || discountId, // Try to parse as integer if possible
        active: newActive,
        "created_at": discountData.created_at || Timestamp.now().toMillis(),
        "updated_at": Timestamp.now().toMillis(),
        price: discountData.price || null,
        type: discountData.type || null,
        start: discountData.start || null,
        end: discountData.end || null,
        products: discountData.products || [],
      }
    };

    console.log('Discount active status toggled successfully:', response);
    return response;
  } catch (error) {
    console.error('Error toggling discount active status:', error);
    throw error;
  }
};
