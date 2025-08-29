import React from 'react';
import Router from './router.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <div className="min-h-screen text-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Router />
      </div>
    </div>
  );
}
