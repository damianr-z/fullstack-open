import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

const NotFound = () => (
  <>
    <ErrorMessage message="Page not found" status={404} retry={false} />
    <Link to="/">Go back to home</Link>
  </>
);

export default NotFound;
