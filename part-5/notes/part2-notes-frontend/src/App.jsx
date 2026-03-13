import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import loginService from './services/login';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // notes require auth, so only fetch if a user is already in state
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
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
        setErrorMessage(
          `Note '${note.content}' was already removed from server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }
    try {
      const fetchedNotes = await noteService.getAll();
      setNotes(fetchedNotes);
    } catch (e) {
      console.error('Failed to fetch notes after login:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    noteService.setToken(null);
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );

  return (
    <main>
      <h1>Notes</h1>

      <h2>{user ? 'Notes' : 'Login'}</h2>

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          {noteForm()}
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'all'}
            </button>
          </div>
          <ul>
            {notesToShow.map((note) => (
              <Note
                key={note.id}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}
              />
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default App;
