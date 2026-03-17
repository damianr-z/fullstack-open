import { useState, useImperativeHandle, forwardRef } from 'react';

const Toogleable = forwardRef(function Toogleable({ children }, ref) {
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
      <button onClick={toggleVisibility}>
        {!visible ? 'Enter new Book' : 'X'}
      </button>
      {visible ? children : null}
    </>
  );
});

export default Toogleable;
