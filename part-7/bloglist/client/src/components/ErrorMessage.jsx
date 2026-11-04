const ErrorMessage = ({ message, status, retry = true }) => (
  <p className="error" role="alert">
    {message}
    {status && ` (error ${status})`}.{retry && ' Please try again later.'}
  </p>
);
export default ErrorMessage;
