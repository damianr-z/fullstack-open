require('dotenv').config();

const PORT = process.env.PORT;

let MONGODB_URI = process.env.MONGODB_URI;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI =
    process.env.TEST_MONGODB_URI ||
    'mongodb://127.0.0.1:27017/bloglistapp_test';
}

module.exports = {
  MONGODB_URI,
  PORT,
};
