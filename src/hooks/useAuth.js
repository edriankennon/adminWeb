import { useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        try {
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            return userCredential.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        logOut
    };
};

export default useAuth;

