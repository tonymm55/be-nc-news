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

module.exports = { fetchArticleById, fetchAllArticles };
