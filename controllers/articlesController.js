const {
  fetchAllArticles,
  fetchArticleById,
} = require("../models/articlesModel");

const getAllArticles = (req, res) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
      } else {
        res.status(404).send({ msg: err.msg });
      }
    });
};

const getSingleArticleById = (req, res) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
      } else {
        res.status(404).send({ msg: err.msg });
      }
    });
};

module.exports = { getAllArticles, getSingleArticleById };
