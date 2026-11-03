import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/useAppContext';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';

const AppContent = () => {
  const { user } = useAppContext();

  return (
    <>
      <NavBar user={user} />
      {/* DONE: 5.24 */}
      <Routes>
        {/* DONE: 5.25 */}
        <Route path="/blogs/:id" element={<Blog />} />
        {/* DONE: 5.26 */}
        <Route path="/create" element={<NewBlog />} />
        <Route path="/" index element={<BlogList />} />
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
