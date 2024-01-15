const {
  fetchAllArticles,
  fetchArticleById,
} = require("../models/articlesModel");

const getAllArticles = (req, res) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

const getSingleArticle = (req, res) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

module.exports = { getAllArticles, getSingleArticle };
