import { useAppContext } from '../context/useAppContext';
import Message from './Message';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

export default function BlogList() {
  const { blogs: blogsToShow, fetchError } = useAppContext();

  return (
    <>
      <Message />

      <h2>Blogs List</h2>
      {fetchError && (
        <ErrorMessage
          message="Failed to fetch blogs"
          retry={false}
          status={fetchError?.response?.status}
        />
      )}
      <div className="blogContainer">
        <div className="blogListPanel">
          <ul className="blogList">
            {blogsToShow
              // .filter((blog) => blog.user?.username === user.username)
              //DONE 5.10
              .toSorted((a, b) => b.likes - a.likes)
              .map((blog) => (
                <li key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} by {blog.author}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
