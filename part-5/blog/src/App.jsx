import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/useAppContext';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import UserBlogs from './components/UserBlogs';

const AppContent = () => {
  const { user } = useAppContext();
  return (
    <>
      <NavBar user={user} />
      // DONE: 5.24
      <Routes>
        <Route path="/" index element={<UserBlogs />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to={'/'} replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
