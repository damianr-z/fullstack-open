import { useAppContext } from '../context/useAppContext';
import NavBar from './NavBar';
import NewBlog from './NewBlog';
import Blog from './Blog';
import Message from './Message';

export default function UserBlogs() {
  const { user, blogs, handleLikeOf, handleDeleteOf } = useAppContext();

  return (
    <>
      <Message />

      <h2>Blogs List</h2>
      <div className="blogContainer">
        <div className="blogListPanel">
          <ul className="blogList">
            {blogs
              // .filter((blog) => blog.user?.username === user.username)
              //✅ 5.10 completed
              .toSorted((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  user={user}
                  blog={blog}
                  handleLike={() => handleLikeOf(blog.id)}
                  handleDelete={() =>
                    handleDeleteOf({ id: blog.id, username: user?.username })
                  }
                />
              ))}
          </ul>
        </div>
        {user && <NewBlog />}
      </div>
    </>
  );
}
