import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';

// Simple debounce function to avoid lodash dependency
const customDebounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
      if (res.data.length > 0 && !activeNoteId) {
        setActiveNoteId(res.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    try {
      const res = await api.post('/notes');
      setNotes([res.data, ...notes]);
      setActiveNoteId(res.data.id);
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const updateNoteAPI = async (id, data) => {
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, data);
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  // Debounced update to avoid too many API calls
  const debouncedUpdate = useCallback(
    customDebounce((id, data) => updateNoteAPI(id, data), 1000),
    []
  );

  const updateActiveNote = (field, value) => {
    const updated = notes.map(n => 
      n.id === activeNoteId ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n
    );
    setNotes(updated);
    
    const noteToUpdate = updated.find(n => n.id === activeNoteId);
    if (noteToUpdate) {
      debouncedUpdate(activeNoteId, { [field]: value });
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      const updated = notes.filter(n => n.id !== id);
      setNotes(updated);
      if (activeNoteId === id) {
        setActiveNoteId(updated.length > 0 ? updated[0].id : null);
      }
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <div style={{ width: '280px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-color)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>My Notes</h3>
          <button onClick={createNote} style={{ background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }}>
            <Plus size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {notes.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No notes yet. Create one!</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => setActiveNoteId(note.id)}
                style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: activeNoteId === note.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent', borderLeft: activeNoteId === note.id ? '3px solid var(--primary-color)' : '3px solid transparent' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.title || 'Untitled'}</h4>
                  <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.content || 'No content...'}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
        {activeNote ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingRight: '24px' }}>
              <input 
                type="text" 
                value={activeNote.title} 
                onChange={e => updateActiveNote('title', e.target.value)}
                placeholder="Note Title"
                style={{ flex: 1, padding: '24px', fontSize: '1.5rem', fontWeight: 700, border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none' }}
              />
              {saving && <Loader2 className="animate-spin text-secondary" size={16} />}
            </div>
            <textarea 
              value={activeNote.content}
              onChange={e => updateActiveNote('content', e.target.value)}
              placeholder="Start typing your note here..."
              style={{ flex: 1, padding: '24px', fontSize: '1rem', border: 'none', background: 'transparent', color: 'var(--text-primary)', resize: 'none', outline: 'none', lineHeight: 1.6 }}
            />
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Select a note or create a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
