'use client';

import NotesComponent from '@/components/notes/Notes';
import { Note } from '@/utils/type/note';
import React, { useState } from 'react';


const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]); // Replace `any` with the actual type if needed

  const handleCreateNote = (newNote: Note) => {
    setNotes((prevNotes) => [...prevNotes, newNote]); // Append the new note to existing notes
  };
  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };
  
  return (
    <div className="p-6">
    
      
      <NotesComponent notes={notes} onCreateNote={handleCreateNote} onUpdateNote={handleUpdateNote} />
      </div>
  );
};

export default NotesPage;
