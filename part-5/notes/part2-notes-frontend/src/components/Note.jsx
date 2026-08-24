import { TableCell } from '@mui/material';
import { Link } from 'react-router-dom';

const Note = ({ note, toggleImportanceOf, deleteNote }) => {

  if (!note) {
    return null;
  }

  const label = note.important ? 'make not important' : 'make important';

  const handleDelete = () => {
    if (window.confirm(`Delete note "${note.content}"`)) {
      deleteNote(note.id);
    }
  };

  return (
    <TableCell>
      <Link to={`/notes/${note.id}`}>{note.content}</Link>
    </TableCell>
      // {toggleImportanceOf && (
      //   <button onClick={toggleImportanceOf}>{label}</button>
      // )}
      // <button onClick={handleDelete}>delete</button>
  );
};

export default Note;
