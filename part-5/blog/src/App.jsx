import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/useAppContext';
import LoginForm from './components/LoginForm';
import UserBlogs from './components/UserBlogs';

const AppContent = () => {
  const { user } = useAppContext();
  return <div className="app">{!user ? <LoginForm /> : <UserBlogs />}</div>;
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
