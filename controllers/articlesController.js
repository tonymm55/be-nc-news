const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
} = require("../models/articlesModel");

const getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      // if (err.code === "22P02") {
      //   res.status(400).send({ msg: "Bad Request" });
      // } else {
      //   res.status(404).send({ msg: err.msg });
      // }
      console.error(err, "<<< error");
      next(err);
    });
};

const getSingleArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.error(err, "<<< error");
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id, "<<< article_id");
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      console.log(comments, "<<< fetch comments");
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.error(err, "<<< error");
      next(err);
    });
};

module.exports = {
  getAllArticles,
  getSingleArticleById,
  getCommentsByArticleId,
};
