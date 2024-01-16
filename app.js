const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topicsController");
const { getAllArticles } = require("./controllers/articlesController");
const { getSingleArticleById } = require("./controllers/articlesController");
const { getCommentsByArticleId } = require("./controllers/articlesController");

const allEndpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send(allEndpoints);
});

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getSingleArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
// console.log("Hello World from app.js");

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route/endpoint not found" });
});

app.use((err, req, res, next) => {
  // handle all psql errors here
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// app.use((err, req, res) => {
//   res.status(500).send({
//     msg: "Internal Server Error",
//   });
// });

module.exports = app;
