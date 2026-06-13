const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
