import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotes, createNote, updateNote } from '../requests.js';

export const useNotes = () => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false, // add this to avoid having the calls every time the browser tab switches back to the app
  });

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.setQueryData(['notes'], notes.concat(newNote));
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const addNote = (content) =>
    newNoteMutation.mutate({ content, important: true });

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({ ...note, important: !note.important });
  };

  const notes = result.data ?? [];

  return {
    notes: result.data,
    isPending: result.isPending,
    addNote,
    toggleImportance,
  };
};
