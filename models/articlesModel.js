const db = require("../db/connection");

const fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Not Found" });
      }
      return rows[0];
    });
};

// Comment count subquery
const fetchAllArticles = () => {
  return db
    .query(
      `SELECT 
        author, 
        title,
        article_id,
        topic,
        created_at,
        votes,
        article_img_url,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
        FROM articles
        ORDER BY created_at DESC`
    )
    .then((result) => {
      // Remove body property from each article object
      return result.rows.map((article) => {
        delete article.body;
        return article;
      });
    });
};

const fetchCommentsByArticleId = (article_id) => {
  // console.log("function is called with article_id >>> ", article_id);
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
      // console.log("Query result >>> ", result);
      if (result.rows.length === 0) {
        console.log(result.rows.length, "<<< rows.length");
        return Promise.reject({ msg: "Not Found" });
      }
      return result.rows;
    });
};

const insertCommentsByArticleId = (comments) => {
  console.log(comments, "<<< insert comments");
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [comments.username, comments.body, comments.article_id]
    )
    .then((result) => {
      console.log(result.rows[0].body, "<<< insert result.rows[0].body");
      return result.rows[0].body;
    });
};

const updateArticleByArticleId = (article_id, inc_votes) => {
  console.log(article_id, inc_votes, "<<< article_id, inc_votes");
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id =$2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((result) => {
      console.log(result.rows, "<<< update votes, (result.rows)");
      return result.rows;
    });
};

const removeCommentByCommentId = (comment_id) => {
  console.log(comment_id, "<<< insert comment_id");
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        console.log(result.rowCount, "<<< result.rowCount");
        console.log(result, "<<< result");
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
