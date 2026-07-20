import { useState, useEffect } from 'react';
import Note from './Note';
import LoginForm from './LoginForm';
import NoteForm from './NoteForm';
import Togglable from './Toggleable';
import noteService from '../services/notes';
import loginService from '../services/login';

const NoteList = ({ notes, setNotes, noteFormRef, addNote }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

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



  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser');
    setUser(null);
    setNotes([]);
    noteService.setToken(null);
  };

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

        // Stored token can expire or become invalid; clear session on 401.
        if (e?.response?.status === 401) {
          window.localStorage.removeItem('loggedNoteAppUser');
          noteService.setToken(null);
          setUser(null);
          setErrorMessage('Your session expired. Please log in again.');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        }
      });
  }, [user]);

  return (
    <main>
      <h1>{user ? 'Notes' : 'Login'}</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {!user && loginForm()}

      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel={'new note'} ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>

          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'all'}
            </button>
          </div>
          <ul>
            {notesToShow.map((note) => (
              <Note
                key={note.id}
                notes={notes}
                toggleImportance={() => toggleImportanceOf(note.id)}
              />
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default NoteList;
