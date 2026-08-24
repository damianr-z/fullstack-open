# Module 5: React Blog App — Key Learnings & Debugging Lessons

## 1. State Update Patterns

- Use `filter` to remove an item from an array in state (e.g., after delete):
  - `setBlogs(prev => prev.filter(blog => blog.id !== id))`
- Use `map` to update/replace a single item in an array (e.g., after like/update):
  - `setBlogs(prev => prev.map(blog => blog.id !== id ? blog : updatedBlog))`

## 2. Comparing Objects in React

- Never compare objects directly with `===` unless you want to check for the same reference, since this is comparing two differnt memory positions and therefore, the result will always be false, even if the values are equal.
- To check if a blog belongs to the logged-in user, compare unique properties:
  - `blog.user?.username === user.username` (string comparison)
  - Or, if available: `blog.user?.id === user.id`

## 3. Passing Props

- `username={user.username}` passes a string prop.
- `username={{ user: user.username }}` passes an object prop (rarely needed).
- Always match the expected prop type in the receiving component.

## 4. Handling Delete Permissions

- Only show the Delete button if the blog belongs to the logged-in user:
  - `{blog.user?.username === username && <button ...>Delete</button>}`
- In the delete handler, check:
  - If the blog exists: `const target = blogs.find(n => n.id === id)`
  - If the blog belongs to the user: `const notRightUser = blogs.find(n => n.user?.username === username)`
- Show clear error messages for each case.

## 5. Authorization Headers

- Always send the Authorization header for protected routes (create, update, delete):
  ```js
  const config = { headers: { Authorization: token } };
  axios.delete(url, config);
  ```
- If you get a 401 error, check that the header is present and valid.

## 6. Debugging Tips

- Use `console.log` to trace function calls and variable values.
- If a function is not running, check parameter passing and handler wiring.
- If a message is not rendering, check that the state is set and the component is using it.
- `.find` returns `undefined` if no match, not `false`.

## 7. General React Advice

- Always update state immutably (never mutate arrays/objects directly).
- Use guard clauses (`if (!id) return;`) to prevent errors.
- Separate logic for existence and ownership checks for clarity.
- Compare primitive values for equality, not whole objects.

## 8. Testing Lessons

- Use `vi.fn()` to create a mock handler and verify that a component calls it with the expected data.
- `beforeEach` is useful when every test needs the same render setup and fresh mocks.
- If a component is wrapped in `Toggleable`, open it before querying hidden form fields.
- Prefer `screen.getByLabelText(...)` for form inputs because it matches how users interact with labeled fields.
- `userEvent.type(...)` and `userEvent.click(...)` are better than manually setting values because they simulate real user behavior.
- `expect(mockFn.mock.calls).toHaveLength(1)` checks that the handler was called exactly once.
- `expect(mockFn).toHaveBeenCalledWith(...)` checks that the handler received the exact submitted object.
- `mock.calls[0][0]` means: first call, first argument.
- Mock context hooks when the test should focus on component behavior instead of provider setup.
- In form submit handlers, use `e.currentTarget` when you need the form element that owns the submit listener.
- For reading form values safely, `new FormData(form)` is more reliable than accessing fields through properties like `form.title`.

---

**This file summarizes the key lessons, patterns, and debugging strategies from your Module 5 React blog app journey.**
