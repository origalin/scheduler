// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getDatabase, onValue, ref, set} from 'firebase/database';
import {useEffect, useState} from "react";
import {getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBo4XVJVe3uetguBYuA2XAl1su6DViSEAk",
    authDomain: "quickreact-90efb.firebaseapp.com",
    databaseURL: "https://quickreact-90efb-default-rtdb.firebaseio.com",
    projectId: "quickreact-90efb",
    storageBucket: "quickreact-90efb.appspot.com",
    messagingSenderId: "600089176792",
    appId: "1:600089176792:web:31aaa035982f4738f8c5ad",
    measurementId: "G-XMJ1B7BRJV"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const dbRef = ref(database, path);
        const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        if (devMode) {
            console.log(`loading ${path}`);
        }
        return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) {
                console.log(val);
            }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
        }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
        });
    }, [path, transform]);

    return [data, loading, error];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export {firebaseSignOut as signOut};

export const useUserState = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
    return [user];
};
