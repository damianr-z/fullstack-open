import { useAppContext } from '../context/useAppContext';
import { Alert } from '@mui/material';

function stripHtmlTags(text = '') {
  return text.replace(/<[^>]*>/g, '');
}

export default function Message() {
  const { message } = useAppContext();

  if (!message) return null;

  const text = stripHtmlTags(message.text ?? '');

  return (
    <Alert severity={message.type} style={{ marginBottom: '1rem' }}>
      {text}
    </Alert>
  );
}
