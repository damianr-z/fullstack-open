const listHelper = require("../utils/list_helper");
const { blogs } = require("../utils/list_helper");

//////// 4.3
test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

////////////// 4.4
describe("total likes", () => {
  const emptyList = [];
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(emptyList);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a better list is calculated right", () => {
    const result = listHelper.totalLikes(listHelper.blogs);
    expect(result).toBe(36);
  });
});

/////////// 4.5
describe("favourite blog", () => {
  test("return the blog with the most likes", () => {
    const result = listHelper.favouriteBlog(listHelper.blogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

/////////// 4.6
describe("most blogs", () => {
  test("return the author that published the most", () => {
    const result = listHelper.mostBlogs(listHelper.blogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

/////////// 4.7
describe("most likes", () => {
  test("return the most popular author", () => {
    const result = listHelper.mostLikes(listHelper.blogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
