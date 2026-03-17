import { useState, useImperativeHandle } from 'react';

const Toogleable = ({ children, buttonLabel = 'Enter new Book', ref }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = (e) => {
    if (e) e.preventDefault();
    setVisible((prev) => !prev);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <>
      <button onClick={toggleVisibility}>{!visible ? buttonLabel : 'X'}</button>
      {visible ? children : null}
    </>
  );
};

export default Toogleable;
