import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig';
import logo1 from '../Images/clinic-logo.png';
import './LoginPage.css';

const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'doctor') {
          navigate('/doctor');
        } else if (role === 'receptionist') {
          navigate('/receptionist');
        } else {
          setError('Unauthorized role');
        }
      } else {
        setError('User data not found');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src={logo1}
          alt="Logo"
          className="logo"
        />
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">CLINIC MANAGEMENT SYSTEM</p>
         <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-select"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-select"
        />
         {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={!email || !password}
          className="login-button"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;