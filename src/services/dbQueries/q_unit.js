import { db, doc, collection, query, addDoc, getDocs, updateDoc, deleteDoc, getDoc, Timestamp } from 'db';


import { v4 as uuidv4 } from 'uuid'


export const createUnitsDb = async (orgId, payload) => {
    const filesCollectionRef = collection(db, 'T_unit');
    const { params } = payload;
    const myId = uuidv4();

    // Extract all locale data from params
    const translations = [];
    const locales = [];
    const titleData = {};

    // Process all title fields with pattern title[locale]
    Object.keys(params).forEach(key => {
        const match = key.match(/^title\[(.*)\]$/);
        if (match && match[1] && params[key] !== undefined && params[key].trim() !== '') {
            const locale = match[1];
            titleData[locale] = params[key];

            translations.push({
                locale: locale,
                title: params[key]
            });

            // Add to locales array
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

    let input = {
        "id": myId,
        "active": params.active === true || params.active === 1 ? 1 : 0,
        "position": params.position || "after",
        "created_at": Timestamp.now().toMillis(),
        "updated_at": Timestamp.now().toMillis(),
        "title": titleData, // Store all titles by locale
        "translations": translations, // Store array of all translations
        "translation": { // Store primary translation for backward compatibility
            "id": myId,
            "locale": primaryLocale,
            "title": primaryTitle,
        },
        "locales": locales, // Store all available locales
    };

    console.log('Creating unit with data:', input);

    try {
        const docRef = await addDoc(filesCollectionRef, input);
        console.log('Unit saved successfully with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving unit to Firestore:', error);
        throw error;
    }
};

export const getAllUnits = async (orgId, params) => {
    console.log('params are ====>', params)

    const filesQuery = query(
        collection(db, `T_unit`), // change to your collection name
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
                    "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/units\/paginate?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "Next &raquo;",
                    "active": false
                }
            ],
            "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/units\/paginate",
            "per_page": "1000",
            "to": files.length,
            "total": files.length
        }
    }
    return y;
};

export const getAllUnitsById = async (orgId, uid, payload) => {
    try {
        const docRef = doc(db, `T_unit`, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data()) {
            console.log('Unit details found:', docSnap.data());
            let unitData = docSnap.data();

            // Set id and uuid
            unitData.id = docSnap.id;
            unitData.uuid = docSnap.id;

            // Format data to match what the form expects
            // If translations doesn't exist or is empty, create it from title data
            if (!unitData.translations || unitData.translations.length === 0) {
                // If there's a translation object with locale and title
                if (unitData.translation && unitData.translation.locale && unitData.translation.title) {
                    unitData.translations = [{
                        locale: unitData.translation.locale,
                        title: unitData.translation.title
                    }];
                }
                // If there's a title object with multiple locales
                else if (typeof unitData.title === 'object') {
                    unitData.translations = Object.keys(unitData.title).map(locale => ({
                        locale,
                        title: unitData.title[locale]
                    }));
                }
            }

            // Ensure 'active' is a boolean value for the Switch component
            unitData.active = unitData.active === 1 || unitData.active === true;

            return { data: unitData };
        } else {
            console.log('No unit details found.');
            return { data: null };
        }
    } catch (error) {
        console.error('Error fetching unit details:', error);
        throw error;
    }
};


export const updateUnits = async (uid, params) => {
    try {
        console.log('params being passed to update function:', uid, params);

        // Extract only defined title values from params
        const titleData = {};
        const translations = [];
        const locales = [];

        Object.keys(params).forEach(key => {
            const match = key.match(/^title\[(.*)\]$/);
            if (match && match[1] && params[key] !== undefined) {
                const locale = match[1];
                titleData[locale] = params[key];

                translations.push({
                    locale: locale,
                    title: params[key]
                });

                // Add to locales array
                if (!locales.includes(locale)) {
                    locales.push(locale);
                }
            }
        });

        console.log('Title data extracted:', titleData);
        console.log('Translations extracted:', translations);
        console.log('Locales extracted:', locales);

        // Only proceed with update if we have at least one title
        if (Object.keys(titleData).length === 0) {
            console.warn('No valid title data found in params, skipping title update');
        }

        // Prepare update data with fields from the API response structure
        const updateData = {
            position: params.position,
            active: params.active === true || params.active === 1 ? 1 : 0,
            updated_at: Timestamp.now().toMillis(),
            locales: locales.length > 0 ? locales : ['en'] // Default to 'en' if no locales
        };

        // Only include title and translations if we have valid data
        if (Object.keys(titleData).length > 0) {
            updateData.title = titleData;
            updateData.translations = translations;

            // Add a single translation object for backward compatibility
            if (translations.length > 0) {
                updateData.translation = {
                    locale: translations[0].locale,
                    title: translations[0].title
                };
            }
        }

        console.log('Update data being saved to Firestore:', updateData);

        await updateDoc(doc(db, `T_unit`, uid), updateData);
        console.log('Unit updated successfully');
        return { success: true };
    } catch (error) {
        console.error('Failed to update unit', error);
        throw error;
    }
};

export const deleteUnits = async (params) => {
    console.log('delete unit is ', params);

    const ids = Object.values(params);

    if (Array.isArray(ids)) {
        try {
            await Promise.all(
                ids.map(async (item) => {
                    await deleteDoc(doc(db, 'T_unit', item));
                })
            );
            console.log('All units deleted successfully');
        } catch (error) {
            console.error('Error deleting units:', error);
        }
    } else {
        console.error('Expected params to contain an array of IDs, but got:', typeof ids);
    }
};

export const setActiveUnits = async (id) => {
    try {
        // Extract the actual ID from the path if needed
        const unitId = id.includes('/') ? id.split('/').pop() : id;

        // Get the current document data
        const docRef = doc(db, 'T_unit', unitId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Unit with ID ${unitId} not found`);
        }

        // Get current data and toggle the active status
        const unitData = docSnap.data();
        const currentActive = unitData.active === 1 || unitData.active === true;
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
                id: parseInt(unitId) || unitId, // Try to parse as integer if possible
                active: newActive,
                position: unitData.position || "before",
                "created_at": Timestamp.now().toMillis(),
                "updated_at": Timestamp.now().toMillis(),
                locales: unitData.locales || ["en"]
            }
        };

        console.log('Unit active status toggled successfully:', response);
        return response;
    } catch (error) {
        console.error('Error toggling unit active status:', error);
        throw error;
    }
};

