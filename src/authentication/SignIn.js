/* global chrome */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    chrome.storage.local.get(['isAuthenticated'], (result) => {
      if (result.isAuthenticated) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="min-h-screen w-full" 
      style={{ 
        background: 'linear-gradient(45deg, #1a1f2e 0%, #1a1f2e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        background: 'radial-gradient(circle at 50% 100%, rgba(32, 223, 177, 0.1) 0%, transparent 70%)',
        zIndex: 1
      }} />

      <div className="max-w-md mx-auto h-screen flex items-center justify-center px-4">
        <div className="w-full bg-[#3b82f6] bg-opacity-90 rounded-xl shadow-lg p-8 text-center text-white relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            Sign in with magic link
          </h1>
          <p className="text-white/90 text-sm mb-8">
            Have a new magic link sent to your email.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-[#1e293b] bg-opacity-80 text-white border-none outline-none mb-4 text-base"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-[#3b82f6] text-white py-3 rounded-md font-semibold hover:bg-[#2563eb] transition-all duration-300"
            >
              SEND REQUEST
            </button>
          </form>

          <div className="mt-6 text-sm text-white/90">
            <p className="mb-2">
              Sign in with email and TOTP?
              <a href="/signin-totp" className="text-white font-bold ml-1 hover:text-blue-200">
                Sign In
              </a>
            </p>
            <p>
              Don't have an account?
              <a href="/signup" className="text-white font-bold ml-1 hover:text-blue-200">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
