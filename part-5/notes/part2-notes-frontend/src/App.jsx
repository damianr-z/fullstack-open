import { useState, useEffect } from 'react';
import Note from './components/Note';
import LoginForm from './components/LoginForm';
import noteService from './services/notes';
import loginService from './services/login';
import Togglable from './components/Toggleable';
import NoteForm from './components/NoteForm';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    noteService
      .getAll()
      .then(setNotes)
      .catch((e) => {
        console.error('Failed to fetch notes:', e);
      });
  }, [user]);

  const addNote = (noteObject) => {
    noteService.create(noteObject).then((returnedNote) => {
      setNotes((prevNotes) => prevNotes.concat(returnedNote));
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
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user));
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
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const loginForm = () => (
    <Togglable buttonLabel={'Click to log in'}>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    </Togglable>
  );

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser');
    setUser(null);
    setNotes([]);
    noteService.setToken(null);
  };

  return (
    <main>
      <h1>{user ? 'Notes' : 'Login'}</h1>

      {!user && loginForm()}

      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel={'new note'}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}

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
    </main>
  );
};

export default App;
