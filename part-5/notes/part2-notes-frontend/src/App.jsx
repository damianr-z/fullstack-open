import { useState, useRef } from 'react';
import { Routes, Route, Link, useMatch } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button } from '@mui/material';
import noteService from './services/notes';
import Notification from './components/Notification';
import Note from './components/Note';
import NoteList from './components/NoteList';
import Home from './components/Home';
import Footer from './components/Footer';
import NoteForm from './components/NoteForm';
import { styled } from 'styled-components';

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Navigation = styled.div`
  background: burlywood;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const App = () => {
  const [notes, setNotes] = useState([]);

  const [notification, setNotification] = useState(null);

  const noteFormRef = useRef();

  const addNote = (noteObject) => {
    noteFormRef.current?.toggleVisibility();
    noteService.create(noteObject).then((returnedNote) => {
      setNotes((prevNotes) => prevNotes.concat(returnedNote));
      setNotification({
        text: `Note '${returnedNote.content}' added`,
        type: 'success',
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch(() => {
        setNotification({
          text: `Note '${note.content}' was already removed from server`,
          type: 'error',
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter((n) => n.id !== id));
    });
  };

  const match = useMatch('/notes/:id');
  const note = match ? notes.find((note) => note.id === match.params.id) : null;

  const style = { '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } };

  return (
    <Page>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/notes" sx={style}>
            Notes
          </Button>
          <Button color="inherit" component={Link} to="/create" sx={style}>
            new note
          </Button>
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/notes/:id"
          element={
            <Note
              note={note}
              toggleImportanceOf={toggleImportanceOf}
              deleteNote={deleteNote}
            />
          }
        />
        <Route
          path="/notes"
          element={
            <NoteList
              notes={notes}
              setNotes={setNotes}
              noteFormRef={noteFormRef}
              addNote={addNote}
              toggleImportanceOf={toggleImportanceOf}
              deleteNote={deleteNote}
            />
          }
        />
        <Route path="/create" element={<NoteForm createNote={addNote} />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Page>
  );
};

export default App;
