const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

const testUserToken = async () => {
  const testUser = {
    username: 'testUser',
    password: 'testPassword',
  };

  const loginDetails = await api.post('/api/login').send(testUser);
  return loginDetails.body.token;
};

const initialBlogs = [
  {
    url: 'themodelhealthshow',
    title: 'Eat Smarter',
    author: 'Shawn Stevenson',
    likes: 10,
  },
  {
    url: 'midudev',
    title: 'Aprendiendo Git y Github',
    author: 'Miguel Angel Duran',
    likes: 9,
  },
];

const initialUsers = [
  {
    username: 'initialUser1',
    name: 'Initial User One',
    passwordHash: '$2b$10$dummyHashForTesting1',
  },
  {
    username: 'initialUser2',
    name: 'Initial User Two',
    passwordHash: '$2b$10$dummyHashForTesting2',
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  testUserToken,
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
};
