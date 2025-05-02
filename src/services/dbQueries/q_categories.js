import { db, doc, collection, query,where, setDoc, getDocs, updateDoc, deleteDoc, getDoc, Timestamp } from 'db';


import { v4 as uuidv4 } from 'uuid'
import { data } from 'browserslist';


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
