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
export const getAllBrands = async (orgId, params) => {
  console.log('params are ====>', params)
  // const {params} = params
  const filesQuery = query(
    collection(db, `brands`),
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

export const getAllBrandsSnap = async (params, callback) => {

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
export const getAllBrandsById = async (orgId, uid, payload) => {
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
export const  createBrandDb = async (orgId, payload)  =>  {
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

export const updateBrand = async (
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
export const deleteBrand= async (params) => {
  console.log('delte user is ', params)
  params.map(async(item) => {
   await deleteDoc(doc(db, 'brands', item))
  })

}



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
