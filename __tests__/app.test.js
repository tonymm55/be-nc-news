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
      .get("/api/toptrumps")
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
        console.log(response.body, "<<< GET /article");
        console.log(response.body.article.created_at, "<<< typeof created_at");
        const { article } = response.body;
        expect(article).toEqual({
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
  // Wed 10-Jan-2024 Error Handling
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not Found");
      });
  });
  test("400: Bad request, INVALID id", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
});
describe("GET /api/articles", () => {
  test("Responds with an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
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
});
