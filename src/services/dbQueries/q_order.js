import { db,doc,collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, Timestamp, setDoc } from 'db';
import { v4 as uuidv4 } from 'uuid';





export const getAllOrder = async (orgId, params) => {
    console.log('params are ====>', params)
    
    // Create base query
    let filesQuery = query(
      collection(db, `p_orders`),
    );

    // Get all documents
    const querySnapshot = await getDocs(filesQuery);
    const files = querySnapshot.docs.map((doc) => {
      let x = doc.data();
      x.id = doc.id; 
      x.uuid = doc.id;
      return x;
    });
    
    console.log('Files from Firestore:', files);
    
    // Combine all orders arrays from all documents and apply delivery type filter
    const allOrders = files.reduce((acc, doc) => {
      if (doc.orders && Array.isArray(doc.orders)) {
        // Filter orders based on delivery_type if provided in params
        const filteredOrders = params?.params?.delivery_type 
          ? doc.orders.filter(order => order.delivery_type === params.params.delivery_type)
          : doc.orders;
        return [...acc, ...filteredOrders];
      }
      return acc;
    }, []);
    
    console.log('Combined and filtered orders:', allOrders);
    
    let y  = {
      data: {
        orders: allOrders,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [
            {
              url: null,
              label: "&laquo; Previous",
              active: false
            },
            {
              url: "https://single-api.foodyman.org/api/v1/dashboard/admin/brands/paginate?page=1",
              label: "1",
              active: true
            },
            {
              url: null,
              label: "Next &raquo;",
              active: false
            }
          ],
          path: "https://single-api.foodyman.org/api/v1/dashboard/admin/brands/paginate",
          per_page: "1000",
          to: allOrders.length,
          total: allOrders.length
        }
      }
    };
    
    console.log('Returning data structure:', {
      hasData: !!y.data,
      hasOrders: !!y.data?.orders,
      ordersLength: y.data?.orders?.length,
      hasMeta: !!y.data?.meta,
      metaKeys: y.data?.meta ? Object.keys(y.data.meta) : null,
      firstOrder: y.data?.orders?.[0] ? 'exists' : 'none',
      deliveryTypeFilter: params?.params?.delivery_type || 'none'
    });
    return y;
  };
  
  export const getAllOrderById = async (orgId, uid, payload) => {
    try {
      console.log('getAllOrderById called with:', { orgId, uid, payload });
      
      // If uid is an object with params, use the first document in the collection
      if (typeof uid === 'object' && uid !== null) {
        console.log('Fetching all orders with params:', uid);
        const filesQuery = query(
          collection(db, `p_orders`),
        );
        const querySnapshot = await getDocs(filesQuery);
        console.log('Query snapshot:', querySnapshot);
        
        const files = querySnapshot.docs.map((doc) => {
          let x = doc.data();
          x.id = doc.id; 
          x.uuid = doc.id;
          return x;
        });
        console.log('Mapped files:', files);
        
        // Filter orders based on delivery_type if provided in params
        const filteredOrders = uid?.params?.delivery_type 
          ? files.filter(order => order.delivery_type === uid.params.delivery_type)
          : files;
        console.log('Filtered orders:', filteredOrders);

        const response = {
          timestamp: new Date().toISOString(),
          status: true,
          message: "Success",
          data: {
            orders: filteredOrders,
            meta: {
              current_page: 1,
              from: 1,
              last_page: 1,
              total: filteredOrders.length
            }
          }
        };
        console.log('Returning response for all orders:', response);
        return response;
      }

      // If uid is a string, use a compound query to find the order
      console.log('Searching for order with ID:', uid);
      
      // Create a query to find documents where orders array contains an order with the given ID
      const ordersQuery = query(
        collection(db, 'p_orders'),
        where('orders', 'array-contains', { id: uid })
      );
      
      console.log('Executing query for order:', uid);
      const querySnapshot = await getDocs(ordersQuery);
      console.log('Query results:', {
        size: querySnapshot.size,
        empty: querySnapshot.empty
      });

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userData = doc.data();
        console.log('Found user document:', {
          id: doc.id,
          hasOrders: userData.orders && Array.isArray(userData.orders),
          ordersCount: userData.orders?.length
        });

        // Find the specific order in the user's orders array
        const order = userData.orders?.find(o => o.id === uid);
        
        if (order) {
          console.log('Found order:', order);
          const response = {
            timestamp: new Date().toISOString(),
            status: true,
            message: "Success",
            data: order
          };
          console.log('Returning response for single order:', response);
          return response;
        }
      }

      console.log('No order found with ID:', uid);
      return {
        timestamp: new Date().toISOString(),
        status: false,
        message: "Order not found",
        data: null
      };
    } catch (error) {
      console.error('Error in getAllOrderById:', error);
      console.error('Error stack:', error.stack);
      return {
        timestamp: new Date().toISOString(),
        status: false,
        message: error.message || "Error fetching order details",
        data: null
      };
    }
  };
  export const  createOrderDb = async (orgId, payload)  =>  {
    try {
      const filesCollectionRef = collection(db, `p_orders`);
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
  
//   export const updateOrder = async (
//     uid,params
  
//   ) => {
//     try {
    
//   console.log('params are ====>', uid,params)
//   let x = params
//   x['images[0]'] = ""
  
  
//       await updateDoc(doc(db, `p_order`, uid), {
//         title: x.title,
//         active: x.active
//       })
//       // enqueueSnackbar('Cost Sheet Updated for Customer', {
//       //   variant: 'success',
//       // })
//     } catch (error) {
//       console.log('Filed updated Cost sheet', error, {
//         ...data,
//       })
    
//     }
//   }
  export const deleteOrder= async (params) => {
    console.log('delte user is ', params)
    params.map(async(item) => {
     await deleteDoc(doc(db, 'p_order', item))
    })
  
  }
  