// src/types/note.ts
export type Note = {
    _id: string;
    title: string;
    content: string;
    bgColor?: string;
    banner?: string;
    type: 'PERSONAL' | 'WORK';
    noteType: 'NOTE' | 'TASK';
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    entityType: 'STATIC' | 'DYNAMIC';
  };
  