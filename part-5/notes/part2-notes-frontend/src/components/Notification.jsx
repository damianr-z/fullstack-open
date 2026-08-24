import { Alert, AlertTitle } from '@mui/material';

const Notification = ({ notification }) => {
  if (!notification) return null;

  return (
    <Alert severity={notification.type} style={{ marginBlock: 10 }}>
      <AlertTitle>
        {notification.type === 'error' ? 'Error' : 'Success'}
      </AlertTitle>
      {notification.text}
    </Alert>
  );
};

export default Notification;
