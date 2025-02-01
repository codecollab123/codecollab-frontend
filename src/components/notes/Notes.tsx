"use client";
import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import React, { useState } from "react";
import {
  Plus,
  Loader2,
  Palette,
  TreePalm,
  FilePenLine,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import BannerChangerPopover from "../shared/BannerChangerPop";
import { ColorPicker } from "../shared/ColorPicker";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { Note } from "@/utils/type/note";
import { EllipsisVertical } from "lucide-react";
type NotesComponentProps = {
  notes: Note[];
  onCreateNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
};

const NotesComponent: React.FC<NotesComponentProps> = ({
  notes,
  onCreateNote,
  onUpdateNote,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState<string>("title");

  // Sorting logic
  const sortedNotes = [...notes].sort((a, b) => {
    if (selectedSortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (selectedSortOption === "date") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const handleEditNote = (noteId: string) => {
    const updatedNote = notes.find((note) => note._id === noteId);
    if (updatedNote) {
      // Perform edit logic (e.g., open a modal, navigate to edit page)
      console.log("Editing note:", updatedNote);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note._id !== noteId);
    // Call a delete function or update state to remove the note
    console.log("Deleted note:", noteId);
  };

  // Create Note Handler
  const handleCreateNote = () => {
    const newNote: Note = {
      _id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "Write something here...",
      bgColor: "#FFFFFF",
      banner: "",
      type: "PERSONAL",
      noteType: "NOTE",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "static-user-id",
      entityType: "STATIC",
    };
    onCreateNote(newNote);
  };

  const handleColorSelect = (noteId: string, color: string) => {
    const updatedNote = notes.find((note) => note._id === noteId);
    if (updatedNote) {
      onUpdateNote({ ...updatedNote, bgColor: color, updatedAt: new Date() });
    }
  };

  const handleChangeBanner = (noteId: string, banner: string) => {
    console.log("Changing banner for note:", noteId, "to:", banner);
    const updatedNote = notes.find((note) => note._id === noteId);
    if (updatedNote) {
      const newNote = { ...updatedNote, banner, updatedAt: new Date() };
      console.log("Updated note:", newNote);
      onUpdateNote(newNote);
    }
  };
  return (
    <div className="flex h-screen">
      <div className="w-30 p-4">
        <SidebarMenu
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          active=""
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ">
        <div className="flex justify-between  items-center mb-2">
          <Header
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            activeMenu="Projects"
            breadcrumbItems={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Notes", link: "/dashboard/notes" },
            ]}
          />
          </div>
          <div className="flex justify-between items-center mb-5">
         <div >
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="text-gray-400 mt-2 hidden md:block">
              Organize your thoughts and ideas. Add, view, and manage your
              personal notes with ease.
            </p>
            </div>
       
            <Button onClick={handleCreateNote}>
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
    
          </div>
      
        {/* Sort Options */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setSelectedSortOption("title")}
            className={`${
              selectedSortOption === "title"
                ? "bg-green-800 text-background"
                : ""
            }`}
          >
            Sort by Title
          </Button>
          <Button
            onClick={() => setSelectedSortOption("date")}
            className={`${
              selectedSortOption === "date"
                ? "bg-green-800 text-background"
                : ""
            }`}
          >
            Sort by Date
          </Button>
        </div>
        {/* Notes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <Loader2 className="my-4 h-8 w-8 animate-spin" />
            </div>
          ) : sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div
                key={note._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: note.bgColor || "#FFFFFF" }}
              >
                <h2 className="font-semibold text-lg  text-gray-800">
                  {note.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2">{note.content}</p>

                {/* HoverCard for Banner Changer */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="p-2 text-black">
                      <TreePalm
                        size={18}
                        className="cursor-pointer transition-all duration-200"
                      />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="shadow-md p-3 rounded-md">
                    <BannerChangerPopover
                      handleChangeBanner={(banner: string) =>
                        handleChangeBanner(note._id, banner)
                      }
                    />
                  </HoverCardContent>
                </HoverCard>

                {/* HoverCard for Color Picker */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="p-2 text-black mt-4">
                      <Palette
                        size={18}
                        className="cursor-pointer transition-all duration-200"
                      />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="shadow-md p-3 rounded-md">
                    <ColorPicker
                      selectedColor={note.bgColor || "#FFFFFF"}
                      onColorSelect={(color: string) =>
                        handleColorSelect(note._id, color)
                      }
                    />
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="p-2 text-black mt-4">
                      <EllipsisVertical
                        size={18}
                        className="cursor-pointer transition-all duration-200"
                      />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="shadow-md p-1 rounded-md w-10 flex flex-col gap-2">
                    {/* Options Menu for Edit and Delete inside HoverCardContent */}
                    <button
                      className="p-2 text-black mt-4"
                      onClick={() => handleEditNote(note._id)}
                    >
                      <FilePenLine
                        size={18}
                        className="cursor-pointer transition-all duration-200 text-white"
                      />
                    </button>
                    <button
                      className="p-2 text-black"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      <Trash2
                        size={18}
                        className="cursor-pointer transition-all duration-200 text-white "
                      />
                    </button>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[40vh] w-full">
              <p>No notes available. Start adding some!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesComponent;
