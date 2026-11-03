const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

const helper = require('./test_helper');

beforeEach(async () => {
  try {
    await User.deleteMany({});

    // Create initial users with proper password hashes
    for (const userData of helper.initialUsers) {
      const user = new User(userData);
      await user.save();
    }
  } catch (err) {
    console.error(err);
  }
});

/// 4.16 - Test for invalid users
test('username less than 3 characters is not accepted', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'ab',
    name: 'Test User',
    password: 'validpassword',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert(
    result.body.error.includes(
      'username and password must be at least three characters long'
    )
  );

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test('password less than 3 characters is not accepted', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'validuser',
    name: 'Test User',
    password: 'ab',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert(
    result.body.error.includes(
      'username and password must be at least three characters long'
    )
  );

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test('username must be unique', async () => {
  const usersAtStart = await helper.usersInDb();

  // First create a user
  const initialUser = {
    username: 'duplicateuser',
    name: 'First User',
    password: 'validpassword',
  };

  await api.post('/api/users').send(initialUser).expect(201);

  // Then try to create another user with the same username
  const duplicateUser = {
    username: 'duplicateuser', // Same username
    name: 'Second User',
    password: 'anothervalidpassword',
  };

  const result = await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  console.log('Error message:', result.body.error);
  assert(result.body.error.includes('expected `username` to be unique'));

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1); // Only one user should be added
});
test('valid user can be created', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'newvaliduser',
    name: 'New Valid User',
    password: 'validpassword',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});

after(async () => {
  await mongoose.connection.close();
});
