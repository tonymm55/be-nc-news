const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const app = require("../app.js");
const db = require("../db/connection.js");
const expectedEndpoints = require("../endpoints.json");

// console.log(process.env, "<<< process.env");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("Responds with an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
      });
  });
  test("Responds with an array of topics with slug & description props", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "GET /api response");
        const topics = body.topics;
        expect(topics).toEqual([
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" },
        ]);
      });
  });
  test("404: Responds with 404 with invalid route/endpoint/path", () => {
    return request(app)
      .get("/api/topicks")
      .expect(404)
      .then((response) => {
        // console.log(response, "<<< response message");
        expect(response.body.msg).toBe("Route/endpoint not found");
      });
  });
});
describe("GET /api", () => {
  test("Responds with a JSON object describing all the available endpoints.", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        // console.log(response.body, "<<< GET /api response");
        expect(200);
        expect(response.body).toEqual(expectedEndpoints);
      });
  });
});

describe("GET /api/articles/:articles_id", () => {
  test("Responds with the appropriate article.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        // console.log(response.body, "<<< GET /article");
        // console.log(response.body.article.created_at, "<<< typeof created_at");
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  // Wed 10-Jan-2024 Lecture: Error Handling
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: Bad request, INVALID id", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  test("Responds with an array of correct data types", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "<<< GET /api response");
        const articles = body.articles;
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Responds with an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.comments, "<<< comments response");
        expect(Array.isArray(body.comments)).toBe(true);
      });
  });
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: Bad request, INVALID id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("Responds with an array of comments with the required properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        // console.log(body.comments, "<<< comments body");
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "icellusedkars",
        body: "Even a broken clock is right twice a day.",
      })
      .expect(201)
      .then((response) => {
        // console.log(response.body, "<<< comments response");
        expect(response.body).toEqual({
          postedComment: "Even a broken clock is right twice a day.",
        });
      });
  });
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        username: "icellusedkars",
        body: "A broken clock has the number 999.",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: Bad request, INVALID id", () => {
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("Responds with required properties", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "icellusedkars",
        body: "Even a broken clock is right twice a day.",
      })
      .expect(201)
      .then((response) => {
        // console.log(response.body, "<<< response(225)");
        expect(response.body).toHaveProperty("postedComment");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Responds with +votes updated in the patched article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 5,
      })
      .expect(201)
      .then((response) => {
        // console.log(response.body.article[0], "<<< test response");
        expect(response.body.article[0]).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Responds with -votes updated in the patched article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -10,
      })
      .expect(201)
      .then((response) => {
        // console.log(response.body.article[0], "<<< test response");
        expect(response.body.article[0]).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({
        inc_votes: -10,
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: Bad request, INVALID id", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Bad request, Incorrect type", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({
        inc_votes: "Ten Votes",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Bad request, Missing Field", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("Responds with required properties", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({
        inc_votes: 5,
      })
      .expect(201)
      .then((response) => {
        // console.log(response.body.article[0], "<<< response");
        expect(response.body.article[0]).toHaveProperty("votes");
      });
  });
});

describe("DELETE /api/comments/:comments_id", () => {
  test("Responds with status 204 and no content.", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  // Wed 10-Jan-2024 Lecture: Error Handling
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: Bad request, INVALID id", () => {
    return request(app)
      .delete("/api/comments/nonsense")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(Array.isArray(users)).toBe(true);
      });
  });
  test("Responds with an array of users with correct data types", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "<<< GET /api body");
        const users = body.users;
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users[0];
        expect([users]).toEqual([
          {
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul",
            username: "rogersop",
          },
        ]);
      });
  });
});

describe("GET /api/articles By Topic Query", () => {
  test("Responds articles of a specific topic (cats)", () => {
    const topic = "cats";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          console.log(article.topic, "<<< article topic");
        });
        expect(
          response.body.articles.every((article) => article.topic === topic)
        ).toBe(true);
      });
  });
  test("Responds with an array of correct data types", () => {
    const topic = "cats";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        // console.log(body, "<<< GET /api response");
        const articles = body.articles;
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
        });
      });
  });
});
