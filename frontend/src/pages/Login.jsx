import React, { useState } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const { data } = await api.post('/users/login', form);
      login(data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl border space-y-4">
        <input
          type="email"
          className="w-full border rounded-lg p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="w-full border rounded-lg p-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full bg-gray-900 text-white rounded-lg py-2">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-sm text-gray-600">
          New here? <Link to="/register" className="text-blue-600">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
