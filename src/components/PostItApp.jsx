import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Check } from 'lucide-react';

const DEFAULT_NOTE_SIZE = {
  width: 200,
  height: 200
};

const STORAGE_KEY = 'postit-notes';

const PostItApp = () => {
  
  const [editingId, setEditingId] = useState(null);
  const [draggedNote, setDraggedNote] = useState(null);
  const [resizingNote, setResizingNote] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(DEFAULT_NOTE_SIZE);

  // Load notes from localStorage on initial render
 
    const [notes, setNotes] = useState(() => {
        try {
          const savedNotes = localStorage.getItem(STORAGE_KEY);
          if (savedNotes) {
            return JSON.parse(savedNotes);
          }
        } catch (error) {
          console.error('Error loading from localStorage:', error);
        }
        return [];
      });
  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [notes]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedNote) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        
        setNotes(notes.map(note => 
          note.id === draggedNote.id 
            ? {
                ...note,
                position: {
                  x: Math.max(0, Math.min(window.innerWidth - (note.size?.width || DEFAULT_NOTE_SIZE.width), draggedNote.initialPos.x + dx)),
                  y: Math.max(0, Math.min(window.innerHeight - (note.size?.height || DEFAULT_NOTE_SIZE.height), draggedNote.initialPos.y + dy))
                }
              }
            : note
        ));
      }
      
      if (resizingNote) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        
        setNotes(notes.map(note =>
          note.id === resizingNote.id
            ? {
                ...note,
                size: {
                  width: Math.max(200, Math.min(400, startSize.width + dx)),
                  height: Math.max(150, Math.min(400, startSize.height + dy))
                }
              }
            : note
        ));
      }
    };

    const handleMouseUp = () => {
      setDraggedNote(null);
      setResizingNote(null);
    };

    if (draggedNote || resizingNote) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNote, resizingNote, startPos, startSize, notes]);

  const getRandomPosition = () => {
    const maxWidth = window.innerWidth - DEFAULT_NOTE_SIZE.width;
    const maxHeight = window.innerHeight - DEFAULT_NOTE_SIZE.height;
    return {
      x: Math.max(20, Math.floor(Math.random() * maxWidth)),
      y: Math.max(20, Math.floor(Math.random() * maxHeight))
    };
  };

  const createNote = () => {
    const position = getRandomPosition();
    const newNote = {
      id: Date.now(),
      content: '',
      position,
      size: { ...DEFAULT_NOTE_SIZE },
      color: getRandomColor(),
      isNew: true
    };
    console.log('Creating new note:', newNote);
    setNotes(prevNotes => [...prevNotes, newNote]);
    setEditingId(newNote.id);
  };

  const updateNote = (id, content) => {
    console.log('Updating note:', id, content);
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, content, isNew: false } : note
      )
    );
    setEditingId(null);
  };

  const deleteNote = (id) => {
    console.log('Deleting note:', id);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const getRandomColor = () => {
    const colors = [
      'bg-yellow-100',
      'bg-green-100',
      'bg-blue-100',
      'bg-pink-100',
      'bg-purple-100'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDragStart = (note, e) => {
    if (e.target.classList.contains('handle')) {
      setDraggedNote({
        id: note.id,
        initialPos: { ...note.position }
      });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResizeStart = (note, e) => {
    e.stopPropagation();
    setResizingNote({ id: note.id });
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize(note.size || { ...DEFAULT_NOTE_SIZE });
  };

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      <button
        onClick={createNote}
        className="fixed top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-2 transition-colors duration-200"
      >
        <Plus className="w-6 h-6" />
      </button>

      {notes.map(note => (
        <div
          key={note.id}
          className={`absolute shadow-lg rounded-lg ${note.color} flex flex-col`}
          style={{
            left: `${note.position.x}px`,
            top: `${note.position.y}px`,
            width: `${note.size?.width || DEFAULT_NOTE_SIZE.width}px`,
            height: `${note.size?.height || DEFAULT_NOTE_SIZE.height}px`
          }}
        >
          <div
            className="handle h-6 bg-black/5 cursor-move flex items-center justify-center"
            onMouseDown={(e) => handleDragStart(note, e)}
          >
            <div className="w-8 h-1 bg-black/10 rounded-full" />
          </div>

          <div className="flex-1 p-3 relative">
            {editingId === note.id ? (
              <textarea
                autoFocus
                className="w-full h-full bg-transparent resize-none outline-none"
                defaultValue={note.content}
                onBlur={(e) => updateNote(note.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    updateNote(note.id, e.target.value);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full relative">
                <div className="whitespace-pre-wrap break-words">
                  {note.content || 'Empty note...'}
                </div>
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <button
                    onClick={() => setEditingId(note.id)}
                    className="p-1 hover:bg-black/5 rounded transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 hover:bg-black/5 rounded transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(note, e)}
          >
            <div 
              className="absolute bottom-0 right-0 w-0 h-0 border-8"
              style={{
                borderColor: 'transparent',
                borderRightColor: 'rgba(0,0,0,0.1)',
                borderBottomColor: 'rgba(0,0,0,0.1)',
                transform: 'rotate(-45deg) translate(25%, 25%)'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostItApp;