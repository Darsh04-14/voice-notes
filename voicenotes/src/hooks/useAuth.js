import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [session, setSession] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            // user is signed in
            if (user) {
              setSession(user);
            } 
            
            // user is signed out
            else {
              setSession(null);
            }
          });
    }, [])

    const signUp = async (email, password) => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
          console.error(err);
        }
      };

      const signIn = async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          console.error(err);
        }
      };

    
    
      const logOut = async () => {
        try {
          await signOut(auth);
        } catch (err) {
          console.error(err);
        }
      };


  return (
    <AuthContext.Provider value={{
        session,
        setSession,
        signUp,
        signIn,
        logOut
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
    return useContext(AuthContext);
}