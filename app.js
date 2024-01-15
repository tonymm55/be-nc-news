const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topicsController");
const { getSingleArticle } = require("./controllers/articlesController");

const allEndpoints = require("./endpoints.json");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send(allEndpoints);
});

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getSingleArticle);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route/endpoint not found" });
});

module.exports = app;
