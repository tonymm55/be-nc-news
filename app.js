const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topicsController");
const { getSingleArticleById } = require("./controllers/articlesController");

const allEndpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send(allEndpoints);
});

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getSingleArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route/endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: err.msg });
  }
});

module.exports = app;
