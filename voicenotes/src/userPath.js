// basically determines if user should go to auth
// stack or home stack

import React from 'react'
import useAuth from './hooks/useAuth'
import App from './App';
import AuthScreen from './screens/AuthScreen';

const UserPath = () => {

    const { session } = useAuth();

  return (
    
      session && session.uid ? <App /> : <AuthScreen />

  )
}
  

export default UserPath