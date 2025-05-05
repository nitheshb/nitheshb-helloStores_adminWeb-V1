
import { db, doc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, Timestamp } from 'db';
import { v4 as uuidv4 } from 'uuid';
 
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
          let groupData = docSnap.data();

          // Set id and uuid
          groupData.id = docSnap.id;
          groupData.uuid = docSnap.id;

          // Format data to match what the form expects
          // If translations doesn't exist or is empty, create it from title data
          if (!groupData.translations || groupData.translations.length === 0) {
              // If there's a translation object with locale and title
              if (groupData.translation && groupData.translation.locale && groupData.translation.title) {
                  groupData.translations = [{
                      locale: groupData.translation.locale,
                      title: groupData.translation.title
                  }];
              }
              // If there's a title object with multiple locales
              else if (typeof groupData.title === 'object') {
                  groupData.translations = Object.keys(groupData.title).map(locale => ({
                      locale,
                      title: groupData.title[locale]
                  }));
              }
          }

          // Ensure 'active' is a boolean value for the Switch component
          groupData.active = groupData.active === 1 || groupData.active === true;

          return { data: groupData };
      } else {
          console.log('No group details found.');
          return { data: null };
      }
  } catch (error) {
      console.error('Error fetching group details:', error);
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