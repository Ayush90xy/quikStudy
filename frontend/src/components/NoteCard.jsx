import React from 'react';
import { Link } from 'react-router-dom';

export default function NoteCard({ note, onDelete }) {
  const snippet = note.content.length > 120 ? note.content.slice(0, 120) + '…' : note.content;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
      <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{snippet}</p>
      <div className="flex items-center justify-between">
        <Link to={`/notes/${note._id}`} className="text-blue-600 text-sm">Edit</Link>
        <button onClick={() => onDelete(note._id)} className="text-red-600 text-sm">Delete</button>
      </div>
    </div>
  );
}
