const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

//////// 4.3
const dummy = (blogs) => {
  return 1;
};
////////////// 4.4
const totalLikes = (blogs) => {
  return blogs.reduce((accum, current) => accum + current.likes, 0);
};
/////////// 4.5
const favouriteBlog = (blogs) => {
  const selected = blogs.reduce((accum, curr) =>
    accum.likes > curr.likes ? accum : curr
  );
  const { title, author, likes } = selected;
  return { title, author, likes };
};
/////////// 4.6
const mostBlogs = (blogs) => {
  const counts = new Map();

  for (let blog of blogs) {
    counts.set(blog.author, (counts.get(blog.author) || 0) + 1);
  }

  let mostFrequent;
  let maxCount = 0;

  counts.forEach((count, num) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = num;
    }
  });

  return {
    author: mostFrequent,
    blogs: maxCount,
  };
};

////////////// 4.7
const mostLikes = (blogs) => {
  let popularAuthor = blogs.reduce((it, { author, likes }) => {
    it[author] = it[author] || 0;
    it[author] += likes;
    return it;
  }, {});

  const mostPopular = Object.keys(popularAuthor).sort(
    (a, b) => popularAuthor[b] - popularAuthor[a]
  )[0];
  return {
    author: mostPopular,
    likes: popularAuthor[mostPopular],
  };
};



module.exports = {
  blogs,
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};

