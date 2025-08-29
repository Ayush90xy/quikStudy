import React, { useEffect, useState } from 'react';
import { api } from '../utils/api.js';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard.jsx';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your notes</h1>
        <Link to="/notes/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create New Note</Link>
      </div>
      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}
      {!loading && notes.length === 0 && (
        <p className="text-gray-600">No notes yet. Click “Create New Note”.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((n) => (
          <NoteCard key={n._id} note={n} onDelete={deleteNote} />
        ))}
      </div>
    </div>
  );
}
