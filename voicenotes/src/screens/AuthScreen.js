import React, {useState} from 'react';
import useAuth from '../hooks/useAuth';

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp } = useAuth();

  const logIn = async () => {
    try {
      await signIn(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const createAccount = async () => {
    console.log("clicked");
    try {
      await signUp(email, password);
    } catch (err) {
      console.error(err);
    }
  };
  
  return(
   <div>
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={logIn}> Sign In</button>
      <button onClick={createAccount}> Sign Up</button>
   </div>
  )
};

export default AuthScreen;