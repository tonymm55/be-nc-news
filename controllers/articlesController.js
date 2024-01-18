const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertCommentsByArticleId,
  updateArticleByArticleId,
  removeCommentByCommentId,
  fetchAllUsers,
} = require("../models/articlesModel");

const getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  console.log("Topic:", topic);
  fetchAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      // console.error(err, "<<< error");
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      // console.error(err, "<<< error");
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(article_id, "<<< article_id");
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      // console.log(comments, "<<< fetch comments");
      res.status(200).send({ comments });
    })
    .catch((err) => {
      // console.error(err, "<<< error");
      next(err);
    });
};

const postCommentsByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  // console.log(article_id, "<<< article_id");

  const comments = {
    username,
    body,
    article_id,
  };
  // console.log(comments, "<<< comments object");

  fetchArticleById(article_id)
    .then(() => {
      return insertCommentsByArticleId(comments);
    })
    .then((postedComment) => {
      // console.log(comment, "<<< insert comments");
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      // console.error(err, "<<< error");
      next(err);
    });
};

const patchArticleByArticleId = (req, res, next) => {
  const { inc_votes } = req.body;
  const article_id = req.params.article_id;
  // console.log(article_id, "<<< article_id");
  // console.log(req.body, "<<< req.body.inc_votes");

  fetchArticleById(article_id)
    .then(() => {
      return updateArticleByArticleId(article_id, inc_votes);
    })
    .then((article) => {
      // console.log(article, "<<< article with updated votes");
      res.status(201).send({ article });
    })
    .catch((err) => {
      // console.error(err, "<<< error");
      next(err);
    });
};

const deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  // console.log(comment_id, "<<< About to call removeCommentByCommentId");
  removeCommentByCommentId(comment_id)
    .then(() => {
      // console.log(comment_id, "<<< Successfully removed comment");
      res.status(204).end();
    })
    .catch((err) => {
      // console.error("Failed to remove comment", err);
      // console.error(err, "<<< error");
      next(err);
    });
};

const getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      // console.error(err, "<<< error");
      next(err);
    });
};

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleByArticleId,
  deleteCommentByCommentId,
  getAllUsers,
};
