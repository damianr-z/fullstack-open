import { useAppContext } from '../context/useAppContext';

export default function Message() {
  const { message } = useAppContext();

  if (!message) return null;

  return (
    <div
      className={message.type}
      dangerouslySetInnerHTML={{ __html: message.text }}
    />
  );
}
