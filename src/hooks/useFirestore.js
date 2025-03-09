import { useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useFirestore(collectionName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError('Failed to add document');
      setLoading(false);
      throw err;
    }
  };

  const getDocuments = async (field, operator, value) => {
    setLoading(true);
    setError(null);
    try {
      let q = collection(db, collectionName);
      if (field && operator && value) {
        q = query(q, where(field, operator, value));
      }
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoading(false);
      return documents;
    } catch (err) {
      setError('Failed to get documents');
      setLoading(false);
      throw err;
    }
  };

  return { addDocument, getDocuments, loading, error };
}

