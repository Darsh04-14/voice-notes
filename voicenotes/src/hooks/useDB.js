import React, { createContext, useContext } from 'react';
import { db } from "../config/firebase";
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    where
  } from "firebase/firestore";
import useAuth from './useAuth';

const DBContext = createContext(null);

export const DBProvider = ({ children }) => {

    const lecturesRef = collection(db, "lectures");
    const { session } = useAuth();
    const uid = session?.uid;

    const getLectures = async (userId = uid) => {
        if (uid) {
            const q = query(lecturesRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const filteredData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
            return filteredData;
        }
    }

    const deleteLecture = async (lectureId) => {
        if(uid) {
            const lectureDoc = doc(db, "lectures", lectureId);
            await deleteDoc(lectureDoc);
        }
    }

    const createLecture = async (title, transcript, summary, quiz) => {
        if (uid) {
            try {
                await addDoc(lecturesRef, {
                    userId: uid,
                    title: title,
                    quiz: quiz,
                    transcript: transcript,
                    summary: summary
                });
            } catch (err) {
                console.error(err);
            }
        }
    }


  return (
    <DBContext.Provider value={{
        getLectures,
        deleteLecture,
        createLecture
    }}>
        {children}
    </DBContext.Provider>
  )
}

export default function useDB() {
    return useContext(DBContext);
}