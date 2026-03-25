import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // for teting user events
import Note from './Note';
import Toggleable from './Toggleable';
import NoteForm from './NoteForm';

test('renders this one', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };
  render(<Note note={note} />);
  const element = screen.getByText(
    'Component testing is done with react-testing-library',
  );

  screen.debug(element);
  expect(element).toBeDefined();
});

test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.getByText('Does not work anymore :(', {
    exact: false,
  });

  expect(element).toBeDefined();
});

test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.queryByText('do not want this thing to be rendered');
  expect(element).toBeNull();
});

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  const { container } = render(<Note note={note} />);

  const li = container.querySelector('.note');
  expect(li).toHaveTextContent(
    'Component testing is done with react-testing-library',
  );
});

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  const mockHandler = vi.fn();

  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText('make not important');
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});

describe('<Toggleable />', () => {
  beforeEach(() => {
    render(
      <Toggleable buttonLabel="show...">
        <div>Toggleable content</div>
      </Toggleable>,
    );
  });

  test('renders its children', () => {
    screen.getByText('Toggleable content');
  });

  test('at start the children are not displayed', () => {
    const element = screen.getByText('Toggleable content');
    expect(element).not.toBeVisible();
  });

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('show...');
    await user.click(button);

    const element = screen.getByText('Toggleable content');
    expect(element).toBeVisible();
  });

  test('toggled content can be closed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('show...');
    await user.click(button);

    const closeButton = screen.getByText('cancel');
    await user.click(closeButton);

    const element = screen.getByText('Toggleable content');
    expect(element).not.toBeVisible();
  });

  test('<NoteForm /> updates parent state and calls onSubmit', async () => {
    const createNote = vi.fn();
    const user = userEvent.setup();

    // render(<NoteForm createNote={createNote} />);
    const { container } = render(<NoteForm createNote={createNote} />)


    /// Selecting by role 
    // const input = screen.getByRole('textbox');
    // await user.type(input, 'testing a form...');
    // const inputs = screen.getAllByRole('textbox')

    /// Selecting using a placeholder
    // const input = screen.getByPlaceholderText('write note content here')
    
    ///Selecting using an id
    
    const input = container.querySelector('#note-input');
    const sendButton = screen.getByText('save');

    // await user.type(input[0], 'testing a form...')
    await user.type(input, 'testing a form...');

    await user.click(sendButton);

    console.log(createNote.mock.calls);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
  });
});
