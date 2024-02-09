const db = require("../db/connection");

const fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT 
        author,
        body,
        title,
        article_id,
        topic,
        created_at,
        votes,
        article_img_url,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count 
        FROM articles 
        WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Not Found" });
      }
      return rows[0];
    });
};

const fetchAllArticles = (topic) => {
  let query = `SELECT 
        author, 
        title,
        article_id,
        topic,
        created_at,
        votes,
        article_img_url,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
        FROM articles`;

  if (topic) {
    query += ` WHERE topic = $1 ORDER BY created_at DESC`;
    return db.query(query, [topic]).then((result) => {
      return result.rows.map((article) => {
        delete article.body;
        return article;
      });
    });
  } else {
    return db.query(query).then((result) => {
      return result.rows.map((article) => {
        delete article.body;
        return article;
      });
    });
  }
};

const fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT 
        comment_id, 
        votes,
        created_at,
        author,
        body,
        article_id
        FROM comments WHERE article_id = $1
        ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "Not Found" });
      }
      return result.rows;
    });
};

const insertCommentsByArticleId = (comments) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [comments.username, comments.body, comments.article_id]
    )
    .then((result) => {
      return result.rows[0].body;
    });
};

const updateArticleByArticleId = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id =$2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

const removeCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ msg: "Not Found" });
      }
      return result.rows[0];
    });
};

const fetchAllUsers = () => {
  return db
    .query(
      `SELECT 
        username, 
        name,
        avatar_url
        FROM users
        ORDER BY username DESC`
    )
    .then((result) => {
      return result.rows.map((users) => {
        return users;
      });
    });
};

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  insertCommentsByArticleId,
  updateArticleByArticleId,
  removeCommentByCommentId,
  fetchAllUsers,
};
