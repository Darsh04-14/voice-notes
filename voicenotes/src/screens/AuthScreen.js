import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import './authScreen.css';
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
    try {
      await signUp(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (



    <div className="authscreen" >
      <div></div>
      <div className="project" >
        <h1 className="auth-card1">Lecture-Lenz 💫</h1>
        <div className="auth-card">

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
      </div>
    </div>

  )
};

export default AuthScreen;