import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-xl">quikStudy</Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link
                to="/dashboard"
                className={`text-sm ${pathname === '/dashboard' ? 'font-semibold' : ''}`}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
