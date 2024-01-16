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
      res.status(404).send({ message: err.message });
    });
};

module.exports = { getAllArticles, getSingleArticleById };
