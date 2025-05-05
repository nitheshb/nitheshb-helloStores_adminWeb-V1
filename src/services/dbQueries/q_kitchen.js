import { db, doc, collection, query, addDoc, getDocs, updateDoc, deleteDoc, getDoc, Timestamp } from 'db';


import { v4 as uuidv4 } from 'uuid'

// export const createKitchenDb = async (orgId, payload) => {
//     const filesCollectionRef = collection(db, 'T_kitchen');
//     const { params } = payload;
//     // const myId = uuidv4();

//     // Extract all locale data from params
//     const translations = [];
//     const locales = [];
//     const titleData = {};
//     const descriptionData = {};


//     // Process all title fields with pattern title[locale]
//     Object.keys(params).forEach(key => {
//         const match = key.match(/^title\[(.*)\]$/);
//         if (match && match[1] && params[key] !== undefined && params[key].trim() !== '') {
//             const locale = match[1];
//             titleData[locale] = params[key];

//             translations.push({
//                 locale: locale,
//                 title: params[key]
//             });

//             // Add to locales array
//             if (!locales.includes(locale)) {
//                 locales.push(locale);
//             }
//         }
//     });

//     // Default to 'en' if no locales found
//     if (locales.length === 0) {
//         locales.push('en');
//     }

//     // Use first locale as primary translation
//     const primaryLocale = locales[0];
//     const primaryTitle = titleData[primaryLocale] || '';
//     const primaryDescription = descriptionData[primaryLocale] || '';

//     let input = {
//         "id": uuidv4(),
//         "active": params.active === true || params.active === 1 ? 1 : 0,
//         "created_at": Timestamp.now().toMillis(),
//         "updated_at": Timestamp.now().toMillis(),
//         "title": titleData, // Store all titles by locale
//         "translations": translations, // Store array of all translations
//         "translation": { // Store primary translation for backward compatibility
//             "id": uuidv4(),
//             "locale": primaryLocale,
//             "title": primaryTitle,
//             "description": primaryDescription,
//         },
//         "locales": locales, // Store all available locales
//         "shop_id": params.shop_id,
//     };

//     console.log('Creating kitchen with data:', input);

//     try {
//         const docRef = await addDoc(filesCollectionRef, input);
//         console.log('Kitchen saved successfully with ID:', docRef.id);
//         return docRef.id;
//     } catch (error) {
//         console.error('Error saving kitchen to Firestore:', error);
//         throw error;
//     }
// };

export const createKitchenDb = async (orgId, payload) => {
    const filesCollectionRef = collection(db, 'T_kitchen');
    const myId = uuidv4();
    
    // Handle both form-based params and direct payload
    const params = payload.params || payload;
    
    // Initialize data structures
    const titleData = {};
    const descriptionData = {};
    const translations = [];
    const locales = [];
    
    // Process nested title and description objects if they exist
    if (params.title && typeof params.title === 'object') {
        Object.keys(params.title).forEach(locale => {
            const value = params.title[locale];
            if (value !== undefined && value !== null && value.trim() !== '') {
                titleData[locale] = value;
                if (!locales.includes(locale)) {
                    locales.push(locale);
                }
            }
        });
    }
    
    if (params.description && typeof params.description === 'object') {
        Object.keys(params.description).forEach(locale => {
            const value = params.description[locale];
            if (value !== undefined && value !== null && value.trim() !== '') {
                descriptionData[locale] = value;
                if (!locales.includes(locale)) {
                    locales.push(locale);
                }
            }
        });
    }
    
    // Process title[locale] and description[locale] format
    Object.keys(params).forEach(key => {
        const titleMatch = key.match(/^title\[(.*)\]$/);
        const descriptionMatch = key.match(/^description\[(.*)\]$/);
        
        if (titleMatch && titleMatch[1]) {
            const locale = titleMatch[1];
            const value = params[key];
            
            if (value !== undefined && value !== null && value.trim() !== '') {
                titleData[locale] = value;
                if (!locales.includes(locale)) {
                    locales.push(locale);
                }
            }
        }
        
        if (descriptionMatch && descriptionMatch[1]) {
            const locale = descriptionMatch[1];
            const value = params[key];
            
            if (value !== undefined && value !== null && value.trim() !== '') {
                descriptionData[locale] = value;
                if (!locales.includes(locale)) {
                    locales.push(locale);
                }
            }
        }
    });
    
    // Default to 'en' if no locales found
    if (locales.length === 0) {
        locales.push('en');
    }
    
    // Build translations array only for locales that have actual data
    locales.forEach(locale => {
        const hasTitle = locale in titleData;
        const hasDescription = locale in descriptionData;
        
        // Only create translation object if this locale has data
        if (hasTitle || hasDescription) {
            translations.push({
                id: myId,
                locale: locale,
                title: hasTitle ? titleData[locale] : "",
                description: hasDescription ? descriptionData[locale] : ""
            });
        }
    });
    
    // Use first locale as primary translation
    const primaryLocale = locales[0];
    const primaryTitle = titleData[primaryLocale] || '';
    const primaryDescription = descriptionData[primaryLocale] || '';
    
    let input = {
        "id": myId,
        "active": params.active === true || params.active === 1 ? 1 : 0,
        "created_at": Timestamp.now().toMillis(),
        "updated_at": Timestamp.now().toMillis(),
        "title": titleData, // Only includes locales with actual title data
        "description": descriptionData, // Only includes locales with actual description data
        "translations": translations, // Only includes locales with actual data
        "translation": {
            "id": myId,
            "locale": primaryLocale,
            "title": primaryTitle,
            "description": primaryDescription
        },
        "locales": locales,
        "shop_id": params.shop_id,
    };
    
    console.log('Creating kitchen with data:', input);
    
    try {
        const docRef = await addDoc(filesCollectionRef, input);
        console.log('Kitchen saved successfully with ID:', docRef.id);
        
        // Return in the expected format
        return {
            id: docRef.id,
            active: input.active === 1,
            shop_id: input.shop_id,
            translation: {
                id: docRef.id,
                locale: input.translation.locale,
                title: input.translation.title,
                description: input.translation.description
            },
            translations: input.translations.map(trans => ({
                ...trans,
                id: docRef.id // Use the Firestore doc ID instead of UUID
            }))
        };
    } catch (error) {
        console.error('Error saving kitchen to Firestore:', error);
        throw error;
    }
};

export const getAllKitchens = async (orgId, params) => {
    console.log('params are ====>', params)

    const filesQuery = query(
        collection(db, `T_kitchen`), // change to your collection name
    );
    const querySnapshot = await getDocs(filesQuery);

    const files = querySnapshot.docs.map((doc) => {
        let x = doc.data();
        // Set id and uuid from the document ID
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
                    "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/seller\/kitchen\/paginate?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "Next &raquo;",
                    "active": false
                }
            ],
            "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/seller\/kitchen\/paginate",
            "per_page": "1000",
            "to": files.length,
            "total": files.length
        }
    }
    return y;
};




export const getKitchenById = async (orgId, uid) => {
    try {
        const docRef = doc(db, `T_kitchen`, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data()) {
            console.log('Kitchen details found:', docSnap.data());
            let kitchenData = docSnap.data();

            // Set id and uuid
            kitchenData.id = docSnap.id;
            kitchenData.uuid = docSnap.id;

            // Format data to match what the form expects
            // If translations doesn't exist or is empty, create it from title data
            if (!kitchenData.translations || kitchenData.translations.length === 0) {
                // If there's a translation object with locale and title
                if (kitchenData.translation && kitchenData.translation.locale && kitchenData.translation.title) {
                    kitchenData.translations = [{
                        locale: kitchenData.translation.locale,
                        title: kitchenData.translation.title
                    }];
                }
                // If there's a title object with multiple locales
                else if (typeof kitchenData.title === 'object') {
                    kitchenData.translations = Object.keys(kitchenData.title).map(locale => ({
                        locale,
                        title: kitchenData.title[locale]
                    }));
                }
            }

            // Ensure 'active' is a boolean value for the Switch component
            kitchenData.active = kitchenData.active === 1 || kitchenData.active === true;

            return { data: kitchenData };
        } else {
            console.log('No kitchen details found.');
            return { data: null };
        }
    } catch (error) {
        console.error('Error fetching kitchen details:', error);
        throw error;
    }
};





export const updateKitchen = async (uid, payload) => {
    try {
        // Handle both direct payload and payload.params format
        const params = payload.params || payload;
        console.log('params being passed to update function:', uid, params);

        // Initialize data structures
        const titleData = {};
        const descriptionData = {};
        const translations = [];
        const locales = [];

        // Process nested title and description objects if they exist
        if (params.title && typeof params.title === 'object') {
            Object.keys(params.title).forEach(locale => {
                const value = params.title[locale];
                if (value !== undefined && value !== null && value.trim() !== '') {
                    titleData[locale] = value;
                    if (!locales.includes(locale)) {
                        locales.push(locale);
                    }
                }
            });
        }
        
        if (params.description && typeof params.description === 'object') {
            Object.keys(params.description).forEach(locale => {
                const value = params.description[locale];
                if (value !== undefined && value !== null && value.trim() !== '') {
                    descriptionData[locale] = value;
                    if (!locales.includes(locale)) {
                        locales.push(locale);
                    }
                }
            });
        }
        
        // Process title[locale] and description[locale] format
        Object.keys(params).forEach(key => {
            const titleMatch = key.match(/^title\[(.*)\]$/);
            const descriptionMatch = key.match(/^description\[(.*)\]$/);
            
            if (titleMatch && titleMatch[1]) {
                const locale = titleMatch[1];
                const value = params[key];
                
                if (value !== undefined && value !== null && value.trim() !== '') {
                    titleData[locale] = value;
                    if (!locales.includes(locale)) {
                        locales.push(locale);
                    }
                }
            }
            
            if (descriptionMatch && descriptionMatch[1]) {
                const locale = descriptionMatch[1];
                const value = params[key];
                
                if (value !== undefined && value !== null && value.trim() !== '') {
                    descriptionData[locale] = value;
                    if (!locales.includes(locale)) {
                        locales.push(locale);
                    }
                }
            }
        });

        // Build translations array combining title and description data
        locales.forEach(locale => {
            const hasTitle = locale in titleData;
            const hasDescription = locale in descriptionData;
            
            if (hasTitle || hasDescription) {
                translations.push({
                    locale: locale,
                    title: hasTitle ? titleData[locale] : "",
                    description: hasDescription ? descriptionData[locale] : ""
                });
            }
        });

        console.log('Title data extracted:', titleData);
        console.log('Description data extracted:', descriptionData);
        console.log('Translations extracted:', translations);
        console.log('Locales extracted:', locales);

        // Default to 'en' if no locales found
        if (locales.length === 0) {
            locales.push('en');
        }

        // Prepare update data
        const updateData = {
            position: params.position,
            active: params.active === true || params.active === 1 ? 1 : 0,
            updated_at: Timestamp.now().toMillis(),
            locales: locales,
            shop_id: params.shop_id,
        };

        // Include title data if available
        if (Object.keys(titleData).length > 0) {
            updateData.title = titleData;
        }

        // Include description data if available
        if (Object.keys(descriptionData).length > 0) {
            updateData.description = descriptionData;
        }

        // Include translations if available
        if (translations.length > 0) {
            updateData.translations = translations;

            // Update primary translation
            updateData.translation = {
                locale: translations[0].locale,
                title: translations[0].title || "",
                description: translations[0].description || ""
            };
        }

        console.log('Update data being saved to Firestore:', updateData);

        await updateDoc(doc(db, `T_kitchen`, uid), updateData);
        console.log('Kitchen updated successfully');
        
        // Return response in expected format
        return {
            success: true,
            data: {
                id: parseInt(uid), // Convert string ID to number if that's your expected format
                active: updateData.active === 1,
                shop_id: updateData.shop_id
            }
        };
    } catch (error) {
        console.error('Failed to update kitchen', error);
        throw error;
    }
};



export const deleteKitchen = async (params) => {
    console.log('delete kitchen is ', params);

    const ids = Object.values(params);

    if (Array.isArray(ids)) {
        try {
            await Promise.all(
                ids.map(async (item) => {
                    await deleteDoc(doc(db, 'T_kitchen', item));
                })
            );
            console.log('All kitchens deleted successfully');
        } catch (error) {
            console.error('Error deleting kitchens:', error);
        }
    } else {
        console.error('Expected params to contain an array of IDs, but got:', typeof ids);
    }
};






export const setActiveKitchen = async (id) => {
    try {
        const kitchenId = id.includes('/') ? id.split('/').pop() : id;

        const docRef = doc(db, 'T_kitchen', kitchenId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Kitchen with ID ${kitchenId} not found`);
        }

        const kitchenData = docSnap.data();
        const currentActive = kitchenData.active === 1 || kitchenData.active === true;
        const newActive = !currentActive;

        await updateDoc(docRef, {
            active: newActive ? 1 : 0,
            updated_at: Timestamp.now().toMillis()
        });

        const response = {
            timestamp: new Date().toISOString(),
            status: true,
            data: {
                id: parseInt(kitchenId) || kitchenId,
                active: newActive,
                position: kitchenData.position || "before",
                "created_at": Timestamp.now().toMillis(),
                "updated_at": Timestamp.now().toMillis(),
                locales: kitchenData.locales || ["en"]
            }
        };

        console.log('Kitchen active status toggled successfully:', response);
        return response;
    } catch (error) {
        console.error('Error toggling kitchen active status:', error);
        throw error;
    }
};
