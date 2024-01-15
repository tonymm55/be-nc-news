const db = require("../db/connection");
console.log("hello world");

const fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      // console.log(article_id, "<<< article_id");
      return rows[0];
    });
};

module.exports = { fetchArticleById };
