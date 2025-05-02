
import {
  db,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from 'db';
import { v4 as uuidv4 } from 'uuid';

import { getAllProductsById } from 'firebase.js';




export const createBannerDb = async (orgId, payload) => {
  try {
    const bannerId = uuidv4();
    const translationId = uuidv4();
    
   
    const timestamp = Timestamp.now().toMillis();

    const {
      title,
      description,
      button_text,
      url,
      products,
      clickable,
      active,
      images,
    } = payload.params || payload;

    console.log('Creating banner with data:', { title, description, button_text, url, products, clickable, active, images });


    const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : '';
    

    const locale = 'en';

    const productIds = Array.isArray(products) && products.length > 0 
      ? products.map(p => typeof p === 'object' ? p.value || p.id : p)
      : [];

    const bannerDoc = {
      id: bannerId,
      url: url || '',
      img: imageUrl,
      active: active === true || active === 1 ? 1 : 0,
      clickable: clickable === true || clickable === 1 ? 1 : 0,
      type: 'banner',
      created_at: timestamp,
      updated_at: timestamp,
      
      translation: {
        id: translationId,
        locale: locale,
        title: title?.[locale] || '',
        description: description?.[locale] || '',
        button_text: button_text?.[locale] || ''
      },
      
      translations: [
        {
          id: translationId,
          locale: locale,
          title: title?.[locale] || '',
          description: description?.[locale] || '',
          button_text: button_text?.[locale] || ''
        }
      ],
      
      locales: [locale],
      
      ...(productIds.length > 0 && { products: productIds })
    };

    await setDoc(doc(db, 'T_banners', bannerId), bannerDoc);
    
    console.log('Banner created successfully with ID:', bannerId);
    

    return { id: bannerId };
  } catch (error) {
    console.error('Error creating banner in Firestore:', error);
    throw error;
  }
};



export const getAllBanner = async (orgId, params) => {
  try {
    console.log('Fetching all banners with params:', params);
    
    const filesQuery = query(collection(db, `T_banners`));
    const querySnapshot = await getDocs(filesQuery);
    

    const banners = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        url: data.url || '',
        img: data.img || '',
        active: data.active,
        clickable: data.clickable,
        type: data.type || 'banner',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        translation: data.translation || {
          id: uuidv4(),
          locale: 'en',
          title: '',
          description: '',
          button_text: ''
        }

      };
    });

    let y = {
      data: banners,
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [
          { url: null, label: '&laquo; Previous', active: false },
          {
            url: 'https://single-api.foodyman.org/api/v1/dashboard/admin/T_banners/paginate?page=1',
            label: '1',
            active: true,
          },
          { url: null, label: 'Next &raquo;', active: false },
        ],
        path: 'https://single-api.foodyman.org/api/v1/dashboard/admin/T_banners/paginate',
        per_page: '1000',
        to: banners.length,
        total: banners.length,
      },
    };
    return y;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};











export const getAllBannerSnap = async (params, callback) => {
  console.log('Setting up banner snapshot with params:', params);
  
  try {

    const status = params?.params?.status || 'published';
    
    const filesQuery = query(
      collection(db, `T_banners`),
      where('status', '==', status),
    );

    const unsubscribe = onSnapshot(filesQuery, (querySnapshot) => {
      const banners = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id || doc.id,
          url: data.url || '',
          img: data.img || '',
          active: data.active,
          clickable: data.clickable,
          type: data.type || 'banner',
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
          translation: data.translation || {
            id: uuidv4(),
            locale: 'en',
            title: '',
            description: '',
            button_text: ''
          }
        };
      });

      const response = {
        data: banners,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [
            { url: null, label: '&laquo; Previous', active: false },
            {
              url: 'https://single-api.foodyman.org/api/v1/dashboard/admin/T_banners/paginate?page=1',
              label: '1',
              active: true,
            },
            { url: null, label: 'Next &raquo;', active: false },
          ],
          path: 'https://single-api.foodyman.org/api/v1/dashboard/admin/T_banners/paginate',
          per_page: '10',
          to: banners.length,
          total: banners.length,
        },
      };

      console.log('Banner snapshot updated with data count:', banners.length);
      callback(response);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up banner snapshot:', error);
    callback({ data: [], meta: { total: 0 } });
  }
};





export const getAllBannerById = async (orgId, uid) => {
  try {
    console.log('Fetching banner by ID:', uid);
    
    const docRef = doc(db, `T_banners`, uid);
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

   
      const galleries = [];
      if (data.img) {
        galleries.push({
          id: data.galleries?.[0]?.id || Math.floor(Math.random() * 100) + 1,
          title: data.img.split('/').pop() || '',
          type: 'users',
          loadable_type: 'App\\Models\\Banner',
          loadable_id: data.id || uid,
          path: data.img,
          base_path: 'api.hellostores.in/storage/images/'
        });
      }


      const formattedBanner = {
        id: data.id || uid,
        url: data.url || '',
        img: data.img || '',
        active: data.active,
        clickable: data.clickable,
        type: data.type || 'banner',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        

        translation: data.translation || {
          id: uuidv4(),
          locale: 'en',
          title: '',
          description: '',
          button_text: ''
        },
        
        translations: data.translations || [
          {
            id: data.translation?.id || uuidv4(),
            locale: data.translation?.locale || 'en',
            title: data.translation?.title || '',
            description: data.translation?.description || '',
            button_text: data.translation?.button_text || ''
          }
        ],
        

        locales: data.locales || ['en'],
        
 
        products: productsDetail.filter(product => product !== null),
        
     
        galleries: galleries
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





export const updateBanner = async (uid, params) => {
  try {
    console.log('Updating banner with ID:', uid);
    console.log('Update params:', JSON.stringify(params, null, 2));


    const docRef = doc(db, `T_banners`, uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Banner with ID ${uid} not found`);
    }
    
    const existingData = docSnap.data();
    

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, -5) + 'Z';


    const {
      title,
      description,
      button_text,
      url,
      products,
      clickable,
      active,
      images,
    } = params;

    const locale = params.translation?.locale || existingData.translation?.locale || 'en';
    
    const imageUrl = Array.isArray(images) && images.length > 0 
      ? images[0] 
      : params.img || existingData.img || '';

    let productIds = [];
    if (Array.isArray(products)) {
      productIds = products
        .filter(p => p != null)
        .map(p => {
          if (typeof p === 'object') {
            return p.value || p.id || p;
          }
          return p;
        });
    }

    const getTitleValue = () => {
      if (title && typeof title === 'object' && title[locale] !== undefined) {
        return title[locale];
      }
      return params[`title[${locale}]`] || existingData.translation?.title || '';
    };
    
    const getDescriptionValue = () => {
      if (description && typeof description === 'object' && description[locale] !== undefined) {
        return description[locale];
      }
      return params[`description[${locale}]`] || existingData.translation?.description || '';
    };
    
    const getButtonTextValue = () => {
      if (button_text && typeof button_text === 'object' && button_text[locale] !== undefined) {
        return button_text[locale];
      }
      return params[`button_text[${locale}]`] || existingData.translation?.button_text || '';
    };


    const translationObject = {
      id: existingData.translation?.id || uuidv4(),
      locale: locale,
      title: getTitleValue(),
      description: getDescriptionValue(),
      button_text: getButtonTextValue()
    };

  
    const bannerUpdateDoc = {
      url: url || existingData.url || '',
      img: imageUrl,
      active: active === true || active === 1 ? 1 : (active === false || active === 0 ? 0 : existingData.active),
      clickable: clickable === true || clickable === 1 ? 1 : (clickable === false || clickable === 0 ? 0 : existingData.clickable),
      updated_at: timestamp,
      
  
      translation: translationObject,
      

      translations: [translationObject],
      

      locales: existingData.locales || [locale],
    };
    

    if (productIds.length > 0) {
      bannerUpdateDoc.products = productIds;
    }

    console.log('Updating with document:', JSON.stringify(bannerUpdateDoc, null, 2));


    await updateDoc(docRef, bannerUpdateDoc);
    console.log('Banner updated successfully with ID:', uid);

    
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};


export const deleteBanner = async (params) => {
  try {
    console.log('Deleting banner(s):', params);
    

    let ids = Array.isArray(params) ? params : Object.values(params);
    
 
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    

    const validIds = ids.filter(id => id && typeof id === 'string');
    
    if (validIds.length === 0) {
      console.error('No valid banner IDs provided for deletion');
      return;
    }
    

    await Promise.all(
      validIds.map(async (id) => {
        await deleteDoc(doc(db, 'T_banners', id));
        console.log('Banner deleted successfully:', id);
      })
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting banners:', error);
    throw error;
  }
};