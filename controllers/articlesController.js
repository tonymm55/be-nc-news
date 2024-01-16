const {
  fetchAllArticles,
  fetchArticleById,
} = require("../models/articlesModel");

const getAllArticles = (req, res) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send({ articles });
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
        res.status(400).send({ message: "Bad Request" });
      } else {
        res.status(404).send({ message: err.message });
      }
    });
};

module.exports = { getAllArticles, getSingleArticleById };
