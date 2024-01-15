const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topicsController");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "Hello World!" });
});

app.get("/api/topics", getAllTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route/endpoint not found" });
});

module.exports = app;
