// import { db } from 'configs/firebaseConfig'
import { db } from 'firebase'
import {
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
  import { v4 as uuidv4 } from 'uuid'



  // get users list
export const steaminactiveUsersList = (orgId, snapshot, error) => {
    const itemsQuery = query(
      collection(db, 'users'),
    //   where('orgId', '==', orgId),
    //   where('userStatus', '==', 'Inactive')
    )
    // console.log('orgname is ====>', orgId)
    return onSnapshot(itemsQuery, snapshot, error)
  }