import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { devtools } from 'zustand/middleware';
import noteService from './services/notes';

const useNoteStore = create(devtools((set, get) => ({
  notes: [],
  filter: 'all',
  actions: {
    initialize: async () => {
      const notes = await noteService.getAll();
      set(() => ({ notes }));
    },
    add: async (content) => {
      const newNote = await noteService.createNew(content);
      set((state) => ({ notes: state.notes.concat(newNote) }));
    },
    toggleImportance: async (id) => {
      const note = get().notes.find((n) => n.id === id);
      const updated = await noteService.update(id, {
        ...note,
        important: !note.important,
      });
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? updated : n)),
      }));
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
})));

export const useNotes = () =>
  useNoteStore(
    useShallow(({ notes, filter }) => {
      if (filter === 'important') return notes.filter((n) => n.important);
      if (filter === 'nonimportant') return notes.filter((n) => !n.important);

      return notes;
    }),
  );

export const useFilter = () => useNoteStore((state) => state.filter);

export const useNoteActions = () => useNoteStore((state) => state.actions);
