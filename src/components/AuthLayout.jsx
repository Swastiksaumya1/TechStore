import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // If route requires auth and user is NOT logged in
    if (authentication && authStatus !== authentication) {
      navigate('/login');
    } 
    // If route DOES NOT require auth (like login/signup) and user IS logged in
    else if (!authentication && authStatus !== authentication) {
      navigate('/');
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? (
    <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl text-blue-600">Loading Access...</h1>
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
