const Blog = ({ blog }) => (
  <div>
    <p>
      {blog.title} by <strong>{blog.author}</strong>
    </p>
  </div>
);

export default Blog;
