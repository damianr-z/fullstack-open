# Test Changes Summary

This document explains the recent fixes made to component tests in the frontend blog project.

## Scope

Updated test files:

- `src/components/BlogForm.test.jsx`
- `src/components/Blog.test.jsx`

## 1) Fix in BlogForm test

### Problem

Running the test for creating a new blog threw:

- `TypeError: showMessage is not a function`

The `BlogForm` component uses values from `useAppContext()`:

- `setBlogs`
- `showMessage`
- `navigate`

But the test mock did not provide these functions.

### Changes made

In `src/components/BlogForm.test.jsx`:

- Added missing mocked context members:
  - `setBlogs: vi.fn()`
  - `showMessage: vi.fn()`
  - `navigate: vi.fn()`
- Adjusted `blogs` mock value to an array (`[]`) instead of a function.
- Passed `blogFormRef` prop with a safe stub:
  - `blogFormRef.current.toggleVisibility: vi.fn()`

### Result

- The `BlogForm` test now runs without the runtime TypeError.
- The expected handler assertion for created blog data passes.

## 2) Fixes in Blog component tests

### Problem

The `Blog` component behavior changed and tests were still using the older contract.

Current `Blog` behavior:

- Reads data from `useAppContext()` (`blogs`, `user`, handlers)
- Resolves blog via route param `useParams()` (`/blogs/:id`)
- Uses context handler `handleLikeOf(blog.id)` for likes

Older test assumptions:

- Passed `blog` directly as prop
- Asserted a `handleLike` prop callback

This mismatch caused failures, including the assertion where expected call count was `2` but got `0`.

### Changes made

In `src/components/Blog.test.jsx`:

- Updated the like-button test to align with current component logic:
  - Added blog `id` and owner `user` in mock data.
  - Mocked `handleLikeOf` from context and asserted it is called twice.
  - Rendered component inside `MemoryRouter` + `Routes` + `Route` with `/blogs/:id`.
- Updated the first two tests to also render via router and provide proper context mocks.
- Added a `renderBlogPage` helper inside the `describe` block to avoid repeating the same routing and mock-context setup.
- The helper builds a shared `baseContext()` and then merges test-specific overrides on top of it.
- This makes it easy to change only the `user` value per test, for example:
  - `user: null` for unauthenticated viewing
  - `user: { username: 'anotherUser' }` for a logged-in non-owner
  - `user: { username: 'ownerUser' }` for the blog creator
- The override object is just a plain JavaScript argument, not a React prop. It is used before rendering so the component receives the correct mocked context from the start.

### Result

- The like-button test now validates the real event path used by the component.
- All tests in `src/components/Blog.test.jsx` pass.

## Verification performed

Executed:

- `npm test -- src/components/BlogForm.test.jsx`
- `CI=true npm test -- src/components/Blog.test.jsx`

Outcome:

- `BlogForm.test.jsx`: passed
- `Blog.test.jsx`: passed (all tests in file)

## Why this approach

These changes keep test updates minimal and focused on contract alignment:

- No production behavior was altered.
- Tests were adapted to the component’s current context + routing architecture.
- Assertions now target the actual handlers invoked by the UI interactions.
- Shared setup was extracted into `renderBlogPage` so the route-based tests stay readable while still allowing per-test context differences.
