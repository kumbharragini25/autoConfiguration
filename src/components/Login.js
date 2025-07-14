import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import bgImg from '../assets/login-bg.jpg'; 
import logo from '../assets/MyConfig.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

   const users = [
    { username: 'admin', password: 'admin@123', displayName: 'Admin' },
    { username: 'user1', password: 'user1@123', displayName: 'User1' },
    { username: 'user2', password: 'user2@123', displayName: 'User2' },
    { username: 'user3', password: 'user3@123', displayName: 'User3' },
    { username: 'user4', password: 'user4@123', displayName: 'User4' },
  ];


   const handleLogin = () => {
    const uname = username.trim().toLowerCase();
    const pass = password.trim();

    const user = users.find(
      (u) => u.username === uname && u.password === pass
    );

    if (user) {
      localStorage.setItem('loggedInUser', user.displayName); // Save user to localStorage
      onLoginSuccess(user.displayName); // Pass to parent
    } else {
      setError('Invalid credentials');
    }
  };


  return (
    <div
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Top Text Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.5rem',
          fontWeight: '600',
          color: '#fff',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ color: '#007bff' }}>Configure</span>{' '}
        <span style={{ color: '#f97a1e', fontStyle: 'italic' }}>Dreams</span>
      </div>

      {/* Login Card */}
            <div
        style={{
            backgroundColor: 'rgba(213, 220, 228, 0.7)', 
            color: '#fff',
            padding: '40px',
            borderRadius: '12px',
            marginLeft: '8%',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        }}
        >
              <div className="text-center mb-4">
                  <img
                      src={logo}
                      alt="MyConfig Logo"
                      style={{
                          maxHeight: '45px',
                          objectFit: 'contain'
                      }}
                  />
              </div>
        <p className="text-dark text-center">Sign in</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Email Address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ borderRadius: '8px', padding: '10px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3" style={{ position: 'relative' }}>
  <Form.Control
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ borderRadius: '8px', padding: '10px', paddingRight: '40px' }}
  />
  <span
    onClick={() => setShowPassword((prev) => !prev)}
    style={{
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#666'
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</Form.Group>


          <div className="d-flex justify-content-between mb-3">
            <span className="text-dark" style={{ fontSize: '0.85rem' }}>
              Forgot Password?
            </span>
          </div>

          <Button
            className="w-100"
            variant="primary"
            style={{ borderRadius: '8px', padding: '10px 0', fontWeight: '500' }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Form>

        <div className="text-dark mt-4 text-center" style={{ fontSize: '0.8rem' }}>
          © 2025 Prescient Technologies Pvt Ltd.
          <div style={{ fontSize: '0.75rem', color: '#666' }}>v1.0.0</div>
        </div>
      </div>
    </div>
  );
}
