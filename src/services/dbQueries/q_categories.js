import { db, doc, collection, query, where, setDoc, getDocs, updateDoc, deleteDoc, getDoc, Timestamp } from 'db';
import { v4 as uuidv4 } from 'uuid';

// Modified createCategoriesDb function with multilingual support
export const createCategoriesDb = async (orgId, payload) => {
  try {
    const { params } = payload;
    
    // Generate a unique ID
    const did = uuidv4();
    
    // Handle translations for all supported languages
    const supportedLanguages = ['en', 'fr', 'th']; // Add all languages you support
    const translations = [];
    const locales = [];
    
    // Default title and description (will be set from primary language)
    let primaryTitle = '';
    let primaryDescription = '';
    
    // Process each supported language
    supportedLanguages.forEach(lang => {
      // Check for title in different formats for this language
      let title = null;
      if (params[`title[${lang}]`]) {
        title = params[`title[${lang}]`];
      } else if (params.title?.[lang]) {
        title = params.title[lang];
      } else if (lang === 'en' && typeof params.title === 'string') {
        // Fallback for English
        title = params.title;
      }
      
      // Check for description in different formats for this language
      let description = null;
      if (params[`description[${lang}]`]) {
        description = params[`description[${lang}]`];
      } else if (params.description?.[lang]) {
        description = params.description[lang];
      } else if (lang === 'en' && typeof params.description === 'string') {
        // Fallback for English
        description = params.description;
      }
      
      // Only add languages that have at least a title
      if (title) {
        translations.push({
          id: did,
          locale: lang,
          title: title,
          description: description || ""
        });
        locales.push(lang);
        
        // Use the first available language as primary (for root-level fields)
        // Or prefer English if available
        if ((!primaryTitle || lang === 'en') && title) {
          primaryTitle = title;
          primaryDescription = description || "";
        }
      }
    });
    
    // If no translations were created, default to English with empty strings
    if (translations.length === 0) {
      translations.push({
        id: did,
        locale: 'en',
        title: "",
        description: ""
      });
      locales.push('en');
      primaryTitle = "";
      primaryDescription = "";
    }
    
    // Prepare the image URL
    const imageUrl = params['images[0]'] || 
                    (params.images && params.images[0]) || 
                    "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png";
    
    // Properly handle active status
    const isActive = params.active === undefined ? false : !!params.active;
    
    // Create category object
    const categoryData = {
      "id": did,
      "uuid": did,
      "keywords": params?.keywords || "",
      "type": params?.type || "main",
      "input": 32767,
      "img": imageUrl,
      "active": isActive,
      "status": params?.status || "published",
      "created_at": Timestamp.now().toMillis(),
      "updated_at": Timestamp.now().toMillis(),
      "shop": null,
      "children": [],
      "parent": null,
      // Always store primary language title and description at root level
      "title": primaryTitle,
      "description": primaryDescription,
      // Set the primary translation (first language or English)
      "translation": translations[0],
      // Add all translations
      "translations": translations,
      "locales": locales
    };
    
    // Save to Firestore
    await setDoc(doc(db, `p_category`, did), categoryData);
    console.log('Category created successfully with ID:', did);
    console.log('Category active status:', isActive);
    console.log('Supported languages:', locales);
    
    // Return with success flag and created record
    return { 
      success: true,
      id: did, 
      ...categoryData,
      // Include a timestamp to force form reset
      _timestamp: new Date().getTime()
    };
  } catch (error) {
    console.error('Error creating category in Firestore:', error);
    // Return failure
    return {
      success: false,
      error: error.message
    };
  }
};

// Modified updateCategory function with multilingual support
export const updateCategory = async (uid, params) => {
  try {
    console.log('Updating category with ID:', uid);
    console.log('Update parameters:', params);
    
    // First get the existing document to properly merge changes
    const docRef = doc(db, `p_category`, uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error(`Category with ID ${uid} not found`);
      throw new Error(`Category with ID ${uid} not found`);
    }
    
    const existingData = docSnap.data();
    console.log('Existing category data:', existingData);
    
    // Create an update object that will contain all fields (both changed and unchanged)
    const updateData = { ...existingData };
    
    // Handle translations for all supported languages
    const supportedLanguages = ['en', 'fr', 'th']; // Add all languages you support
    const translations = [...(updateData.translations || [])];
    const locales = [...(updateData.locales || [])];
    
    // Default primary title and description (will update if we find new values)
    let primaryTitle = updateData.title;
    let primaryDescription = updateData.description;
    let primaryLocale = updateData.translation?.locale || 'en';
    
    // Process each supported language
    supportedLanguages.forEach(lang => {
      // Check for title in different formats for this language
      let hasUpdate = false;
      let title = null;
      let description = null;
      
      if (params[`title[${lang}]`] !== undefined) {
        title = params[`title[${lang}]`];
        hasUpdate = true;
      } else if (params.title?.[lang] !== undefined) {
        title = params.title[lang];
        hasUpdate = true;
      } else if (lang === 'en' && typeof params.title === 'string' && params.title !== undefined) {
        title = params.title;
        hasUpdate = true;
      }
      
      if (params[`description[${lang}]`] !== undefined) {
        description = params[`description[${lang}]`];
        hasUpdate = true;
      } else if (params.description?.[lang] !== undefined) {
        description = params.description[lang];
        hasUpdate = true;
      } else if (lang === 'en' && typeof params.description === 'string' && params.description !== undefined) {
        description = params.description;
        hasUpdate = true;
      }
      
      if (hasUpdate) {
        // Find if there's a translation for this language already
        const langTranslationIndex = translations.findIndex(t => t.locale === lang);
        
        if (langTranslationIndex >= 0) {
          // Update existing translation
          const updatedTranslation = { ...translations[langTranslationIndex] };
          if (title !== null) updatedTranslation.title = title;
          if (description !== null) updatedTranslation.description = description || updatedTranslation.description;
          translations[langTranslationIndex] = updatedTranslation;
        } else {
          // Add a new translation
          translations.push({
            id: uid,
            locale: lang,
            title: title || "",
            description: description || ""
          });
          
          // Add to locales if not already there
          if (!locales.includes(lang)) {
            locales.push(lang);
          }
        }
        
        // Update primary title and description if this is the primary language
        // Or if English and we don't have a primary language yet
        if (lang === primaryLocale || (lang === 'en' && !primaryLocale)) {
          if (title !== null) primaryTitle = title;
          if (description !== null) primaryDescription = description;
        }
      }
    });
    
    // Handle image
    if (params.images && params.images[0]) updateData.img = params.images[0];
    if (params['images[0]']) updateData.img = params['images[0]'];
    
    // Handle other fields
    if (params.active !== undefined) updateData.active = params.active;
    if (params.keywords !== undefined) updateData.keywords = params.keywords;
    if (params.type !== undefined) updateData.type = params.type;
    if (params.status !== undefined) updateData.status = params.status;
    
    // Update timestamp
    updateData.updated_at = Timestamp.now().toMillis();
    
    // Update translations and locales
    updateData.translations = translations;
    updateData.locales = locales;
    
    // Set primary title and description at root level
    updateData.title = primaryTitle;
    updateData.description = primaryDescription;
    
    // Update translation object to primary language
    const primaryTranslation = translations.find(t => t.locale === primaryLocale) || translations[0];
    updateData.translation = primaryTranslation;
    
    console.log('Final update data:', updateData);
    
    // Use setDoc with merge option to ensure all fields are updated
    await setDoc(doc(db, `p_category`, uid), updateData, { merge: true });
    console.log('Category updated successfully with ID:', uid);
    
    // Return the updated category data for confirmation
    return { success: true, id: uid, data: updateData };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Updated getAllCategories function to handle multilingual display
export const getAllCategories = async (orgId, params) => {
  console.log('params are ====>', params);
  
  const filesQuery = query(
    collection(db, `p_category`),
    where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    
    // Ensure title is always available in the root object
    // First check if we already have a title
    if (!x.title && x.translations && x.translations.length > 0) {
      // Try to find the preferred language translation first
      const preferredLang = params?.params?.lang || 'en';
      const preferredTranslation = x.translations.find(t => t.locale === preferredLang);
      
      if (preferredTranslation) {
        x.title = preferredTranslation.title;
      } else {
        // Fall back to the first available translation
        x.title = x.translations[0].title;
      }
    }
    
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
          "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/brands\/paginate?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": null,
          "label": "Next &raquo;",
          "active": false
        }
      ],
      "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/brands\/paginate",
      "per_page": "1000",
      "to": files.length,
      "total": files.length
    }
  };
  return y;
};

// Updated getAllCategoriesById to handle multilingual display
export const getAllCategoriesById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid);
    const docSnap = await getDoc(docRef);

    console.log('Document data:', docSnap.data());

    if (docSnap.exists() && docSnap.data()) {
      console.log('Category details found:', docSnap.data());
      let x = docSnap.data();
      x.id = docSnap.id;
      x.uuid = docSnap.id;
      
      // Ensure image property is consistent
      x.img = x['images[0]'] || x.img;
      
      // Make sure title is available at root level
      // If there's no title but there are translations
      if (!x.title && x.translations && x.translations.length > 0) {
        // Try to find the preferred language translation first
        const preferredLang = payload?.params?.lang || 'en';
        const preferredTranslation = x.translations.find(t => t.locale === preferredLang);
        
        if (preferredTranslation) {
          x.title = preferredTranslation.title;
        } else {
          // Fall back to the first available translation
          x.title = x.translations[0].title;
        }
      }

      return { data: x };
    } else {
      console.log('No category details found.');
      return { data: null };
    }
  } catch (error) {
    console.error('Error fetching category details:', error);
    throw error;
  }
};


export const deleteCategory = async (params) => {
  console.log('delete categories:', params);
 
  const ids = Object.values(params);
 
  if (Array.isArray(ids)) {
    try {
      await Promise.all(
        ids.map(async (item) => {
          await deleteDoc(doc(db, 'p_category', item)); 
        })
      );
      console.log('All Categories deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting Categories:', error);
      throw error;
    }
  } else {
    console.error('Expected params to contain an array of IDs, but got:', typeof ids);
    throw new Error('Invalid parameter format for deletion');
  }
};