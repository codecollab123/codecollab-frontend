import React from "react";

import NotesContainer from "./NoteContainer";

import { Note } from "@/utils/type/note";

interface NotesRenderProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  isArchive: boolean;
  isTrash?: boolean;
  fetchNotes: () => Promise<void>;
}

const NotesRender = ({
  notes,
  setNotes,
  isArchive,
  isTrash,
  fetchNotes,
}: NotesRenderProps) => (
  <NotesContainer
    notes={notes}
    setNotes={setNotes}
    isArchive={isArchive}
    isTrash={isTrash}
    fetchNotes={fetchNotes}
  />
);

export default NotesRender;
