import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from './components/NotFound';
import { AppProvider } from './context/AppContext';
import ErrorFallback from './components/ErrorFallBack';
import { useAppContext } from './context/useAppContext';
import { ErrorBoundary } from 'react-error-boundary';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';

const logError = (error, info) => {
  console.error('Error caught by ErrorBoundary:', error);
  console.error('Error info:', info.componentStack);
};

const AppContent = () => {
  const { user } = useAppContext();
  const { pathname } = useLocation();

  return (
    <>
      <NavBar user={user} />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[pathname]}
        onError={logError}
      >
        {/* DONE: 5.24 */}
        <Routes>
          {/* DONE: 5.25 */}
          <Route path="/blogs/:id" element={<Blog />} />
          {/* DONE: 5.26 */}
          <Route path="/create" element={<NewBlog />} />
          <Route path="/" index element={<BlogList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
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
