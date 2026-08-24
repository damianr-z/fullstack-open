const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

// const getTokenFrom = (request) => {
//   // const authorization = request.get('authorization');
//   // if (authorization && authorization.startsWith('Bearer ')) {
//   //   return authorization.replace('Bearer ', '');
//   // } else {
//   //   return null;
//   // }
// };

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  blog ? response.json(blog) : response.status(404).end;
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 });

  response.json(updateBlog);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).send({ error: 'missing data' });
  }

  const user = request.user;
  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

// app.post('/api/notes', async (request, response) => {
//   const body = request.body;
//   if (!body.content) {
//     return response.status(400).json({ error: 'content missing' });
//   }
//   const token = getTokenFrom(request);
//   if (!token) {
//     return response.status(401).json({ error: 'token missing' });
//   }
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, process.env.SECRET);
//   } catch {
//     return response.status(401).json({ error: 'token invalid' });
//   }
//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     user: decodedToken.id,
//   });
//   const savedNote = await note.save();
//   response.status(201).json(savedNote);
// });

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    const user = request.user;
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }
    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: 'only the creator can delete this blog' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

module.exports = blogsRouter;
