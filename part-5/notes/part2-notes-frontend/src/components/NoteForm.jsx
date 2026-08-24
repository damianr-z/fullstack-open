import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: false,
    });
    navigate('/notes');
    setNewNote('');
  };

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <TextField
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
          label="Write your note"
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 10 }}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default NoteForm;
