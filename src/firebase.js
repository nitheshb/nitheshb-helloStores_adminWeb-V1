import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'

import { batch as reduxBatch } from 'react-redux';
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
  VAPID_KEY,
} from './configs/app-global';
import { store } from './redux/store';
import {
  setMessages,
  setMessagesLoading,
  setUserIds,
} from './redux/slices/chat';
import { toast } from 'react-toastify';
import userService from './services/seller/user';
import { setFirebaseToken } from './redux/slices/auth';
import { data } from 'browserslist';

// const firebaseConfig = {
//   apiKey: API_KEY,
//   authDomain: AUTH_DOMAIN,
//   projectId: PROJECT_ID,
//   storageBucket: STORAGE_BUCKET,
//   messagingSenderId: MESSAGING_SENDER_ID,
//   appId: APP_ID,
//   measurementId: MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyAa_8w1leO584ByuE3-hAvVN2Xoidz-8HA",
  authDomain: "hellostores-860e8.firebaseapp.com",
  projectId: "hellostores-860e8",
  storageBucket: "hellostores-860e8.firebasestorage.app",
  messagingSenderId: "158530064456",
  appId: "1:158530064456:web:56dfcf5e59764251d8487d",
  measurementId: "G-X93PZ3YNQJ"
};



const app = initializeApp(firebaseConfig);

const messaging = getMessaging();
export const db = getFirestore(app);

export const firebaseChatList = [];

export function buildChatList(userDataList, firebaseChatList) {
  // reverse array for searching from end to beginning;
  firebaseChatList.reverse();

  return userDataList?.data?.map((userDataItem) => {
    const chatItem = firebaseChatList.find((item) =>
      item.ids.includes(userDataItem.id),
    );
    return { ...chatItem, user: userDataItem };
  });
}


export function steaminactiveUsersList (orgId, snapshot, error) {
  const itemsQuery = query(
    collection(db, 'users'),
  //   where('orgId', '==', orgId),
  //   where('userStatus', '==', 'Inactive')
  )
  // console.log('orgname is ====>', orgId)
  return onSnapshot(itemsQuery, snapshot, error)
}

// brands




// categories
export const getAllCategories = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_category`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const getAllCategoriesById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createCategoriesDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_category`);
    const { params } = payload;
    params.status = 'published';

    console.log('categories are ====>', params)
    

    // {title[en]: 'Restaurant Equipment', description[en]: 'Reliable Commercial Restaurant Kitchen Equipment For Every Application', keywords: 'equipment', images: Array(1), active: 1, …}
    // active
    // : 
    // 1
    // description[en]
    // : 
    // "Reliable Commercial Restaurant Kitchen Equipment For Every Application"
    // images
    // : 
    // [{…}]
    // images[0]
    // : 
    // "https://foodyman.s3.amazonaws.com/public/images/categories/103-e0bcb86b-a30c-49f6-ba27-8b6aa8c346e5.webp"
    // keywords
    // : 
    // "equipment"
    // parent_id
    // : 
    // null
    // status
    // : 
    // "published"
    // title[en]
    // : 
    // "Restaurant Equipment"
    // type
    // : 
    // "main"}

// {  //     "id": 17,
  //     "uuid": "c0a6605b-d97e-4f0c-bf47-465c0a114528",
  //  "input": 32767,
  //     "img": "https:\/\/foodyman.s3.amazonaws.com\/public\/images\/categories\/103-1682503302.webp",
    //     "created_at": "2023-04-26 09:01:49Z",
  //     "updated_at": "2023-09-29 11:55:43Z",
  // "shop": null,
  // "children": [],
  //     "parent": null
    //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Pies",
  //             "description": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture"
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
// }
    
  //   {
  //     "id": 17,
  //     "uuid": "c0a6605b-d97e-4f0c-bf47-465c0a114528",
  //     "keywords": "Pies",
  //     "type": "main",
  //     "input": 32767,
  //     "img": "https:\/\/foodyman.s3.amazonaws.com\/public\/images\/categories\/103-1682503302.webp",
  //     "active": true,
  //     "status": "published",
  //     "created_at": "2023-04-26 09:01:49Z",
  //     "updated_at": "2023-09-29 11:55:43Z",
  //     "shop": null,
  //     "translation": {
  //         "id": 18,
  //         "locale": "en",
  //         "title": "Pies"
  //     },
  //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Pies",
  //             "description": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture"
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
  //     "children": [],
  //     "parent": null
  // }
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_category`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateCategory = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteCategory= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}


// Units
export const getAllUnits=async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Units`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/units\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/units\/paginate?page=1",
    "prev": null,
    "next": null
},
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
    "per_page": "10",
    "to": 5,
    "total": 5
}}
  return y;
};


export const getAllUnitsById= async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `brands`, uid)
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
export const  createUnitsDb=async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `brands`);
    const { params } = payload;
    params.status = 'published';
    const docRef = await addDoc(filesCollectionRef, {...params});
    console.log('Files saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateUnits= async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `brands`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteUnits=async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'brands', item))
  })

}


// products
export const getAllProducts = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Products`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=50",
    "prev": null,
    "next": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=2"
},
"meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 50,
    "links": [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=2",
            "label": "2",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=3",
            "label": "3",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=4",
            "label": "4",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=5",
            "label": "5",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=6",
            "label": "6",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=7",
            "label": "7",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=8",
            "label": "8",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=9",
            "label": "9",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=10",
            "label": "10",
            "active": false
        },
        {
            "url": null,
            "label": "...",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=49",
            "label": "49",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=50",
            "label": "50",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate?page=2",
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/products\/paginate",
    "per_page": "10",
    "to": 10,
    "total": 498
}}
  return y;
};


export const getAllProductsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createProductsDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_Products`);
    const { params } = payload;
    params.status = 'published';

    console.log('categories are ====>', params)
    
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `Products`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
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


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteProducts= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}



// discounts
export const getAllDiscounts = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Discounts`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/seller\/discounts\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/seller\/discounts\/paginate?page=1",
    "prev": null,
    "next": null
},
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
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/seller\/discounts\/paginate?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": null,
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/seller\/discounts\/paginate",
    "per_page": "10",
    "to": 3,
    "total": 3
}}
  return y;
};


export const getAllDiscountsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `Discounts`, uid)
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
export const  createDiscountsDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_discounts`);
    const { params } = payload;
    const myId = uuidv4()
    // discounts are ====> 
    //   {price: 8000, type: 'percent', products: Array(1), start: '2025-04-17', end: '2025-04-18'}
    //   end
    //   : 
    //   "2025-04-18"
    //   price
    //   : 
    //   8000
    //   products
    //   : 
    //   [557]
    //   start
    //   : 
    //   "2025-04-17"
    //   type
    //   : 
    //   "percent"
    //   [[Prototype]]
    //   : 
    //   Object
    let input ={
            "id": myId,
            "shop_id": params.products[0],
            "type": params.type,
            "price": params.price,
            "start": params.start,
            "end": params.end,
            "active": true,
            "created_at": Timestamp.now().toMillis(),
            "updated_at": Timestamp.now().toMillis(),
        }
    console.log('discounts are ====>', params)
   

  
    
 
  

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_discounts`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateDiscounts = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_discounts`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteDiscounts= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_discounts', item))
  })

}


// Extra values
export const getAllValues = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Values`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2",
    "prev": null,
    "next": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2"
},
"meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 2,
    "links": [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2",
            "label": "2",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2",
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values",
    "per_page": "10",
    "to": 10,
    "total": 15
}}
  return y;
};


export const getAllValuesById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createValuesDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_Values`);
    const { params } = payload;
    const myId=uuidv4()

    let input=
    {
      "id": myId,
      "extra_group_id": params.extra_group_id,
      "value": params.value,
      "active": true
  }

 

    console.log('Values are ====>', params,input)
   

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_Values`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateValues = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteValues= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}

// Extra group
export const getAllGroups = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Groups`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2",
    "prev": null,
    "next": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2"
},
"meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 2,
    "links": [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2",
            "label": "2",
            "active": false
        },
        {
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values?page=2",
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/extra\/values",
    "per_page": "10",
    "to": 10,
    "total": 15
}}
  return y;
};


export const getAllGroupsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createGroupsDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_groupValues`);
    const { params } = payload;
    const myId = uuidv4()
    let input=
    {
      "id": myId,
      "type": params.type,
      "active": true
  }
    
    console.log('groupValues are ====>', params,input)
   

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_groupValues`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateGroups = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteGroups= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}

// users
export const getAllUsers = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Users`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/users\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/users\/paginate?page=1",
    "prev": null,
    "next": null
},
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
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/users\/paginate?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": null,
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/users\/paginate",
    "per_page": "10",
    "to": 2,
    "total": 2
}}
  return y;
};


export const getAllUsersById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createUsersDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_category`);
    const { params } = payload;
    params.status = 'published';

    console.log('categories are ====>', params)
    
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_category`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateUsers = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteUsers= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}

// delivery
export const getAllDeliverymans = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Deliverymans`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/deliverymans\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/deliverymans\/paginate?page=1",
    "prev": null,
    "next": null
},
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
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/deliverymans\/paginate?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": null,
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/deliverymans\/paginate",
    "per_page": "10",
    "to": 2,
    "total": 2
}}
  return y;
};
export const getAllDeliverymansSnap = async (params, callback) => {

  console.log('snap are ====>', params)


    try {
      
   
  
    const filesQuery1 = query(
      collection(db, `brands`),
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

export const getAllDeliverymansById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createDeliverymansDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_category`);
    const { params } = payload;
    params.status = 'published';

    console.log('categories are ====>', params)
    
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `Products`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateDeliverymans = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteDeliverymans= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}



// order
export const getAllOrder = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_order`),
    // where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};

export const getAllOrderById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_order`, uid)
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
export const  createOrderDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_order`);
    const { params } = payload;
    params.status = 'published';

    console.log('orders are ====>', params)
    

    // {title[en]: 'Restaurant Equipment', description[en]: 'Reliable Commercial Restaurant Kitchen Equipment For Every Application', keywords: 'equipment', images: Array(1), active: 1, …}
    // active
    // : 
    // 1
    // description[en]
    // : 
    // "Reliable Commercial Restaurant Kitchen Equipment For Every Application"
    // images
    // : 
    // [{…}]
    // images[0]
    // : 
    // "https://foodyman.s3.amazonaws.com/public/images/categories/103-e0bcb86b-a30c-49f6-ba27-8b6aa8c346e5.webp"
    // keywords
    // : 
    // "equipment"
    // parent_id
    // : 
    // null
    // status
    // : 
    // "published"
    // title[en]
    // : 
    // "Restaurant Equipment"
    // type
    // : 
    // "main"}

// {  //     "id": 17,
  //     "uuid": "c0a6605b-d97e-4f0c-bf47-465c0a114528",
  //  "input": 32767,
  //     "img": "https:\/\/foodyman.s3.amazonaws.com\/public\/images\/categories\/103-1682503302.webp",
    //     "created_at": "2023-04-26 09:01:49Z",
  //     "updated_at": "2023-09-29 11:55:43Z",
  // "shop": null,
  // "children": [],
  //     "parent": null
    //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Pies",
  //             "description": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture"
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
// }
    
  //   {
  //     "id": 17,
  //     "uuid": "c0a6605b-d97e-4f0c-bf47-465c0a114528",
  //     "keywords": "Pies",
  //     "type": "main",
  //     "input": 32767,
  //     "img": "https:\/\/foodyman.s3.amazonaws.com\/public\/images\/categories\/103-1682503302.webp",
  //     "active": true,
  //     "status": "published",
  //     "created_at": "2023-04-26 09:01:49Z",
  //     "updated_at": "2023-09-29 11:55:43Z",
  //     "shop": null,
  //     "translation": {
  //         "id": 18,
  //         "locale": "en",
  //         "title": "Pies"
  //     },
  //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Pies",
  //             "description": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture"
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
  //     "children": [],
  //     "parent": null
  // }
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_category`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateOrder = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_order`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteOrder= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_order', item))
  })

}


// reviews
export const getAllReviews = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `Reviews`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate?page=1",
    "prev": null,
    "next": null
},
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
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": null,
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate",
    "per_page": "10",
    "to": 7,
    "total": 7
}}
  return y;
};


export const getAllReviewsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_category`, uid)
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
export const  createReviewsDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_category`);
    const { params } = payload;
    params.status = 'published';

    console.log('categories are ====>', params)
    
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `Products`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateReviews = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_category`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteReviews= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_category', item))
  })

}



// banner
export const getAllBanner = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_banner`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const getAllBannerById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_banner`, uid)
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
export const  createBannerDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_banner`);

    const myId = uuidv4()
    const { params } = payload;
    let input ={

          "id": myId,
          "url": params.url,
          "img": params.images[0],
          "active": params.active,
          "clickable": params.clickable,
          "type": "banner",
          "created_at": Timestamp.now().toMillis(),
          "updated_at": Timestamp.now().toMillis(),
    
  }
    console.log('banner are ====>', params)
    
    
 
    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_banner`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateBanner = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_banner`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteBanner= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_banner', item))
  })

}


// refund
export const getAllRefund = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_refund`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const getAllRefundById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_refund`, uid)
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
export const  createRefundDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_refund`);
    const { params } = payload;
    params.status = 'published';

    console.log('refund are ====>', params)
    
  const did = uuidv4()
  const x = {
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "shop": null,
    "children": [],
    "parent": null,
    "title": params['title[en]'],
    "description": params['description[en]'],
    // "title[en]": "Pies",
    // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
    "id": did,
    "uuid": did,
    "keywords": params?.keywords,
    "type": params?.type,
    "input": 32767,
    "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
    "active": true,
    "status": "published",
          "translation": {
          "id": 18,
          "locale": "en",
          "title": "Commercial Ref"
      },
      "translations": [
          {
              "id": 18,
              "locale": "en",
              "title": "Commercial Ref1",
              "description": params['description[en]']
          }
      ],
      "locales": [
          "en"
      ],
   
  }

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_category`, did), x)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateRefund = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_refund`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteRefund= async (params) => {
  console.log('delete user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_refund', item))
  })

}

// referral
export const getAllReferral = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_referral`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const updateReferral = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_referral`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}


// Order status
export const getAllOrderStatus = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_order_status`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const getAllOrderStatusById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_order_status`, uid)
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




// Bonus
// export const getAllBonus = async (orgId, params) => {
//   console.log('params are ====>', params)
//   // const {params} = params
//   const filesQuery = query(
//     collection(db, `p_bonus`),
//     where('status', '==', params?.params?.status || 'published'),
//   );
//   const querySnapshot = await getDocs(filesQuery);
//   const files = querySnapshot.docs.map((doc) => {
//     let x = doc.data();
//     x.id = doc.id; 
//     x.uuid = doc.id;
//     return x;
//   });
  
  
// let y  = {data:files, 
//    "meta": {
//   "current_page": 1,
//   "from": 1,
//   "last_page": 1,
//   "links": [
//       {
//           "url": null,
//           "label": "&laquo; Previous",
//           "active": false
//       },
//       {
//           "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/brands\/paginate?page=1",
//           "label": "1",
//           "active": true
//       },
//       {
//           "url": null,
//           "label": "Next &raquo;",
//           "active": false
//       }
//   ],
//   "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/brands\/paginate",
//   "per_page": "1000",
//   "to": files.length,
//   "total": files.length
// }}
//   return y;
// };





//Product Bonus
export const getAllProductBonuses = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_refund`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};

export const getAllProductBonusesById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_refund`, uid)
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
export const  createProductBonusesDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_product_bonuses`);
    const { params } = payload;
    params.status = 'published';

    console.log('refund are ====>', params)
    
  const myId = uuidv4()
  // const x = {
  //   "created_at": Timestamp.now().toMillis(),
  //   "updated_at": Timestamp.now().toMillis(),
  //   "shop": null,
  //   "children": [],
  //   "parent": null,
  //   "title": params['title[en]'],
  //   "description": params['description[en]'],
  //   // "title[en]": "Pies",
  //   // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
  //   "id": did,
  //   "uuid": did,
  //   "keywords": params?.keywords,
  //   "type": params?.type,
  //   "input": 32767,
  //   "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
  //   "active": true,
  //   "status": "published",
  //         "translation": {
  //         "id": 18,
  //         "locale": "en",
  //         "title": "Commercial Ref"
  //     },
  //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Commercial Ref1",
  //             "description": params['description[en]']
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
   
  // }

  let input ={
    "id": myId,
    "bonusable_type": "App\\Models\\Shop",
    "bonusable_id": params.bonusable_id,
    "bonus_quantity": params.bonus_quantity,
    "bonus_stock_id": params.bonus_stock_id,
    "value": params.value,
    "type": "sum",
    "status": true,
    "expired_at": params.expired_at,
    // "bonusStock": {
    //     "id": params.bonus_stock_id,
    //     "countable_id": 1,
    //     "price": 120,
    //     "quantity": 100,
    //     "total_price": 120,
    //     "addon": false,
    //     "product": {
    //         "id": params.bonus_stock_id,
    //         "uuid": "e081bba9-3bc7-4486-81c2-ab09705dbadc",
    //         "active": false,
    //         "addon": false,
    //         "visibility": false,
    //         "vegetarian": false,
    //         "stocks_count": 0,
    //         "rating_percent": null,
    //         "discounts": [],
    //         "translation": {
    //             "id": 1,
    //             "locale": "en",
    //             "title": "Apple 1kg",
    //             "description": "Fresh apple"
    //         },
    //         "reviews": []
    //     }
    // },
    // "bonusable": {
    //     "id": params.bonusable_id,
    //     "uuid": "8d684b24-2bc4-4718-9255-f55cef966f39",
    //     "tax": null,
    //     "open": false,
    //     "visibility": null,
    //     "invite_link": "/shop/invitation/8d684b24-2bc4-4718-9255-f55cef966f39/link",
    //     "products_count": 0,
    //     "translation": {
    //         "id": 6,
    //         "locale": "en",
    //         "title": "Hellostores"
    //     },
    //     "locales": []
    // }
}

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_product_bonuses`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateProductBonuses = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_refund`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteProductBonuses= async (params) => {
  console.log('delete user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_refund', item))
  })

}


// Branch Bonus
export const getAllBranchBonuses = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_refund`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const getAllBranchBonusesById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_refund`, uid)
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
export const  createBranchBonusesDb = async (orgId, payload)  =>  {
  debugger;
  try {
    const filesCollectionRef = collection(db, `p_branch_bonuses`);
    const { params } = payload;
    params.status = 'published';

    console.log('branch_bonuses are ====>', params)
    
  const myId = uuidv4()
  // const x = {
  //   "created_at": Timestamp.now().toMillis(),
  //   "updated_at": Timestamp.now().toMillis(),
  //   "shop": null,
  //   "children": [],
  //   "parent": null,
  //   "title": params['title[en]'],
  //   "description": params['description[en]'],
  //   // "title[en]": "Pies",
  //   // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
  //   "id": did,
  //   "uuid": did,
  //   "keywords": params?.keywords,
  //   "type": params?.type,
  //   "input": 32767,
  //   "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
  //   "active": true,
  //   "status": "published",
  //         "translation": {
  //         "id": 18,
  //         "locale": "en",
  //         "title": "Commercial Ref"
  //     },
  //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Commercial Ref1",
  //             "description": params['description[en]']
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
   
  // }

  let input ={
    "id": myId,
    "bonusable_type": "App\\Models\\Shop",
    "bonusable_id": params.bonusable_id,
    "bonus_quantity": params.bonus_quantity,
    "bonus_stock_id": params.bonus_stock_id,
    "value": params.value,
    "type": "sum",
    "status": true,
    "expired_at": params.expired_at,
    // "bonusStock": {
    //     "id": params.bonus_stock_id,
    //     "countable_id": 1,
    //     "price": 120,
    //     "quantity": 100,
    //     "total_price": 120,
    //     "addon": false,
    //     "product": {
    //         "id": params.bonus_stock_id,
    //         "uuid": "e081bba9-3bc7-4486-81c2-ab09705dbadc",
    //         "active": false,
    //         "addon": false,
    //         "visibility": false,
    //         "vegetarian": false,
    //         "stocks_count": 0,
    //         "rating_percent": null,
    //         "discounts": [],
    //         "translation": {
    //             "id": 1,
    //             "locale": "en",
    //             "title": "Apple 1kg",
    //             "description": "Fresh apple"
    //         },
    //         "reviews": []
    //     }
    // },
    // "bonusable": {
    //     "id": params.bonusable_id,
    //     "uuid": "8d684b24-2bc4-4718-9255-f55cef966f39",
    //     "tax": null,
    //     "open": false,
    //     "visibility": null,
    //     "invite_link": "/shop/invitation/8d684b24-2bc4-4718-9255-f55cef966f39/link",
    //     "products_count": 0,
    //     "translation": {
    //         "id": 6,
    //         "locale": "en",
    //         "title": "Hellostores"
    //     },
    //     "locales": []
    // }
}

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_branch_bonuses`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateBranchBonuses = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_refund`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteBranchBonuses= async (params) => {
  console.log('delete user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_refund', item))
  })

}



// coupon
export const getAllCoupon = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `p_coupon`),
    where('status', '==', params?.params?.status || 'published'),
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
}}
  return y;
};


export const getAllCouponById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_coupon`, uid)
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
export const  createCouponDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_coupon`);
    const { params } = payload;
    const myId = uuidv4()
    // coupon are ====> 
    //   {name: 'SUMANTH', type: 'fix', expired_at: '2025-04-19', qty: 6, price: 500, …}
    //   expired_at
    //   : 
    //   "2025-04-19"
    //   name
    //   : 
    //   "SUMANTH"
    //   price
    //   : 
    //   500
    //   qty
    //   : 
    //   6
    //   shop_id
    //   : 
    //   501
    //   status
    //   : 
    //   "published"
    //   title[en]
    //   : 
    //   "REFER1"
    //   type
    //   : 
    //   "fix"
    //   [[Prototype]]
    //   : 
    //   Object
    let input = { 
      "id": myId,
      "name": params.name,
      "type": params.type,
      "qty": params.qty,
      "price":  params.price,
      "expired_at": Timestamp.now().toMillis(),
      "img": null,
      "created_at": Timestamp.now().toMillis(),
      "updated_at": Timestamp.now().toMillis(),
      "translation": {
          "id": 1,
          "locale": "en",
          "title": "REFER1"
      }
  }
    console.log('coupon are ====>', params)
    
  

    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `coupon`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateCoupon = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_coupon`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteCoupon= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_coupon', item))
  })

}


//Blog Notifications - Promotion Management (Notifications)

export const getAllBlogsNotifications = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `BlogsNotifications`),
    // where('status', '==', params?.params?.status || 'published'),
  );
  const querySnapshot = await getDocs(filesQuery);
  const files = querySnapshot.docs.map((doc) => {
    let x = doc.data();
    x.id = doc.id; 
    x.uuid = doc.id;
    return x;
  });
  
  
let y  = {data:files, 
  "links": {
    "first": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate?page=1",
    "last": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate?page=1",
    "prev": null,
    "next": null
},
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
            "url": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": null,
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "path": "https:\/\/single-api.foodyman.org\/api\/v1\/dashboard\/admin\/reviews\/paginate",
    "per_page": "10",
    "to": 7,
    "total": 7
}}
  return y;
};


export const getAllBlogsNotificationsById = async (orgId, uid, payload) => {
  try {
    const docRef = doc(db, `p_blogs_notifications`, uid)
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
export const  createBlogsNotificationsDb = async (orgId, payload)  =>  {
  try {
    const filesCollectionRef = collection(db, `p_blogs_notifications`);
    const { params } = payload;
    params.status = 'published';

    console.log('blogsnotifications are ====>', params)

    
  const myId = uuidv4()
  // const x = {
  //   "created_at": Timestamp.now().toMillis(),
  //   "updated_at": Timestamp.now().toMillis(),
  //   "shop": null,
  //   "children": [],
  //   "parent": null,
  //   "title": params['title[en]'],
  //   "description": params['description[en]'],
  //   // "title[en]": "Pies",
  //   // "description[en]": "Dish made by lining a shallow container with pastry and filling the container with a sweet or savoury mixture",
 
  //   "id": did,
  //   "uuid": did,
  //   "keywords": params?.keywords,
  //   "type": params?.type,
  //   "input": 32767,
  //   "img": "https://cdnimg.webstaurantstore.com/uploads/design/2023/5/Homepage-Categories/category-refrigeration.png",
  //   "active": true,
  //   "status": "published",
  //         "translation": {
  //         "id": 18,
  //         "locale": "en",
  //         "title": "Commercial Ref"
  //     },
  //     "translations": [
  //         {
  //             "id": 18,
  //             "locale": "en",
  //             "title": "Commercial Ref1",
  //             "description": params['description[en]']
  //         }
  //     ],
  //     "locales": [
  //         "en"
  //     ],
   
  // }

  let input = {
    "id": myId,
    // "uuid": uuid(),
    "user_id": 103,
    "type": "blog",
    "active": true,
    "created_at": Timestamp.now().toMillis(),
    "updated_at": Timestamp.now().toMillis(),
    "translation": {
        "id": myId,
        "locale": "en",
        "title": params.title.tr,
        "short_desc": params.short_desc.tr,
    },
    "locales": [
        "en"
    ]
}
console.log('Files', input);
    // const docRef = await addDoc(filesCollectionRef, {...x});
    const docRef= await setDoc(doc(db, `p_blogs_notifications`, myId), input)
    console.log('Files saved successfully with ID:', docRef);
    
    return docRef;
  } catch (error) {
    console.error('Error saving files to Firestore:', error);
    throw error;
  }
};

export const updateBlogsNotifications = async (
  uid,params

) => {
  try {
  
console.log('params are ====>', uid,params)
let x = params
x['images[0]'] = ""


    await updateDoc(doc(db, `p_blogs_notifications`, uid), {
      title: x.title,
      active: x.active
    })
    // enqueueSnackbar('Cost Sheet Updated for Customer', {
    //   variant: 'success',
    // })
  } catch (error) {
    console.log('Filed updated Cost sheet', error, {
      ...data,
    })
  
  }
}
export const deleteBlogsNotifications= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'p_blogs_notifications', item))
  })

}


export function getChat(currentUserId) {
  try {
    const chatCollectionRef = collection(db, 'chat');
    const chatQuery = query(
      chatCollectionRef,
      where('ids', 'array-contains', currentUserId),
      orderBy('time', 'asc'),
    );

    return onSnapshot(chatQuery, (chatSnapshot) => {
      const firebaseChats = chatSnapshot.docs.map((doc) => ({
        chatId: doc.id,
        ...doc.data(),
      }));

      firebaseChatList.push(...firebaseChats);

      const userIds = [
        ...new Set(
          firebaseChats
            .map(
              (firebaseChat) =>
                firebaseChat.ids.filter((id) => id !== currentUserId)[0],
            )
            .filter(Boolean),
        ),
      ];

      store.dispatch(setUserIds(userIds));
    });
  } catch (error) {
    console.error(error);
  }
}

export function fetchMessages(chatId, userId) {
  if (!chatId) return null;
  try {
    const q = query(collection(db, 'chat', chatId, 'message'), orderBy('time'));

    return onSnapshot(q, async (querySnapshot) => {
      const fetchedMessages = [];
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        const messageRef = doc.ref;
        const message = doc.data();
        fetchedMessages.push({
          id: doc.id,
          message: message.message,
          time: message.time,
          read: message.read,
          senderId: message.senderId,
          type: message.type,
          replyDocId: message.replyDocId,
          isLast: false,
        });

        if (message.senderId !== userId && !message.read) {
          batch.update(messageRef, {
            read: true,
          });
        }
      });
      fetchedMessages.sort((a, b) => new Date(a.time) - new Date(b.time));
      if (fetchedMessages[querySnapshot.size - 1]) {
        fetchedMessages[querySnapshot.size - 1].isLast = true;
      }
      reduxBatch(() => {
        store.dispatch(setMessagesLoading(false));
        store.dispatch(setMessages(fetchedMessages));
      });
      await batch.commit();
    });
  } catch (error) {
    console.error(error);
  }
}

export async function sendMessage(currentUserId, chatId, payload) {
  if (!chatId || !currentUserId) return null;
  try {
    const chatRef = doc(db, 'chat', chatId);

    await updateDoc(chatRef, {
      lastMessage: payload.message,
      time: serverTimestamp(),
    });

    const body = {
      read: false,
      time: new Date().toISOString(),
      senderId: currentUserId,
      ...payload,
    };

    if (payload.type) {
      body.type = payload.type;
    }

    await addDoc(collection(db, 'chat', chatId, 'message'), body);
  } catch (error) {
    toast.error(error.message);
    console.error(error);
  }
}

export async function editMessage(
  currentUserId,
  chatId,
  payload,
  editingMessage,
) {
  if (!chatId || !currentUserId || !editingMessage || !payload) return null;
  try {
    const messageRef = doc(
      db,
      'chat',
      chatId,
      'message',
      editingMessage.message.id,
    );
    if (editingMessage.message.isLast) {
      await updateDoc(doc(db, 'chat', chatId), {
        lastMessage: payload.message,
        time: serverTimestamp(),
      });
    }
    await updateDoc(messageRef, {
      message: payload.message,
    });
  } catch (error) {
    toast.error(error.message);
    console.error(error);
  }
}

export async function deleteChat(currentChatId) {
  try {
    await deleteDoc(doc(db, 'chat', currentChatId));
  } catch (error) {
    toast.error(error);
  }
}

export async function deleteMessage(chatId, message, messageBeforeLastMessage) {
  if (!chatId || !message) return null;
  try {
    await deleteDoc(doc(db, 'chat', chatId, 'message', message.id));
    if (message.isLast) {
      await updateDoc(doc(db, 'chat', chatId), {
        lastMessage: messageBeforeLastMessage
          ? messageBeforeLastMessage.message
          : '',
        time: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
}

export async function fetchRepliedMessage(
  messageId,
  currentChatId,
  setReplyMessage,
) {
  if (currentChatId) {
    const q = doc(db, 'chat', currentChatId, 'message', messageId);
    return onSnapshot(q, (snapshot) => {
      const message = snapshot.data();
      setReplyMessage({
        id: snapshot.id,
        message: message?.message,
        type: message?.type,
      });
    });
  }
}

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        store.dispatch(setFirebaseToken(currentToken));
        const payload = { firebase_token: currentToken };
        userService
          .profileFirebaseToken(payload)
          .then((res) => console.log('firebase token sent => ', res));
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.',
        );
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
