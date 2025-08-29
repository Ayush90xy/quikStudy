import React, { useEffect, useRef, useState } from 'react';
import { api } from '../utils/api.js';
import { useNavigate, useParams } from 'react-router-dom';
import Mindmap from '../components/Mindmap.jsx';
import { debounce } from '../utils/debounce.js';

export default function NoteEditor({ createMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(!createMode);
  const [saving, setSaving] = useState(false);
  const [aiOut, setAiOut] = useState('');
  const [lang, setLang] = useState('Spanish');
  const [showMindmap, setShowMindmap] = useState(false);
  const suggestRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!createMode) {
          const { data } = await api.get(`/notes/${id}`);
          setNote({ title: data.title, content: data.content });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, createMode]);

  const save = async () => {
    setSaving(true);
    try {
      if (createMode) {
        const { data } = await api.post('/notes', note);
        navigate(`/notes/${data._id}`);
      } else {
        await api.put(`/notes/${id}`, note);
      }
    } catch (e) {
      alert(e?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const runAI = async (feature, payload) => {
    setAiOut('Working…');
    try {
      const { data } = await api.post(`/ai/${feature}`, payload);
      setAiOut(data.result);
    } catch (e) {
      setAiOut(e?.response?.data?.message || 'AI request failed');
    }
  };

  // Auto-suggest (debounced on content changes)
  const debouncedSuggest = debounce(async (partial) => {
    if (!partial.trim()) return;
    try {
      const { data } = await api.post('/ai/auto-suggest', { partial });
      suggestRef.current = data.result;
    } catch (e) {
      suggestRef.current = '';
    }
  }, 700);

  const onContentChange = (v) => {
    setNote((n) => ({ ...n, content: v }));
    const lastLine = v.split('\n').pop();
    debouncedSuggest(lastLine);
  };

  const acceptSuggestion = () => {
    const sug = suggestRef.current;
    if (!sug) return;
    setNote((n) => ({ ...n, content: n.content + (n.content.endsWith(' ') ? '' : ' ') + sug }));
    suggestRef.current = '';
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <input
          className="w-full border rounded-lg p-2 text-lg font-semibold"
          placeholder="Note title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
        <button onClick={save} className="px-4 py-2 rounded-lg bg-gray-900 text-white">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <textarea
            className="w-full min-h-[360px] border rounded-lg p-3 whitespace-pre-wrap"
            placeholder="Write your note here. Use - bullets for mindmap nodes."
            value={note.content}
            onChange={(e) => onContentChange(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => runAI('summarize', { text: note.content })}
              className="px-3 py-2 rounded-lg border bg-white"
            >
              Summarize
            </button>
            <div className="flex items-center gap-2">
              <select
                className="border rounded-lg p-2"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Hindi</option>
                <option>Japanese</option>
              </select>
              <button
                onClick={() => runAI('translate', { text: note.content, language: lang })}
                className="px-3 py-2 rounded-lg border bg-white"
              >
                Translate
              </button>
            </div>
            <button
              onClick={() => setShowMindmap((s) => !s)}
              className="px-3 py-2 rounded-lg border bg-white"
            >
              {showMindmap ? 'Hide Mindmap' : 'Visualize as Mindmap'}
            </button>

            <button
              onClick={acceptSuggestion}
              className="px-3 py-2 rounded-lg border bg-white"
              title="Accept auto-suggestion"
            >
              Accept Suggestion
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border rounded-2xl p-3">
            <h3 className="font-semibold mb-2">AI Output</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap min-h-[160px]">
              {aiOut || 'Results from Summarize / Translate appear here.'}
            </div>
          </div>
        </div>
      </div>

      {showMindmap && <Mindmap title={note.title} content={note.content} />}
    </div>
  );
}
