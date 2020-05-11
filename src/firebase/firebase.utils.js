import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';



const config = {
    apiKey: "AIzaSyAGaSYNPiFvacmPWxpqle00H0DGTL6-LNA",
    authDomain: "crown-clothing-8433f.firebaseapp.com",
    databaseURL: "https://crown-clothing-8433f.firebaseio.com",
    projectId: "crown-clothing-8433f",
    storageBucket: "crown-clothing-8433f.appspot.com",
    messagingSenderId: "95025627677",
    appId: "1:95025627677:web:f80af9dadf87a3a9187cf4"
};

export const createUserProfileDocument = async (userAuth, additionslData) => {
    if(!userAuth){
        return;
    } 

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    
    
    const snapShot = await userRef.get();
  

    if(!snapShot.exists){
        const {displayName, email} = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
              displayName,
              email,
              createdAt,
              ...additionslData 
            })
        } catch (error) {
            console.log('is-error creating the user', error.message)
        }

        
    }
    return userRef;
}

firebase.initializeApp(config);

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);
    
    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc();
        batch.set(newDocRef, obj);
    })

    return await batch.commit()
}

export const converCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
        const {title, items} = doc.data();

        return {
            routeName: encodeURI(title.toLowerCase()),
            id:doc.id,
            title,
            items
        }
    })

    return transformedCollection.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {})
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;