const db = require("../db/connection");

const fetchAllArticles = (sort_by = "slug") => {
  // this is fully SQL-injection proof!
  const validSortQueries = ["slug", "description"];
  // const validOrderQueries = ["asc", "desc"];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }
  // if (!validOrderQueries.includes(order)) {
  //   return Promise.reject({ status: 400, msg: "Invalid order query" });
  // }
  let query = `SELECT * FROM articles`;
  return db.query(query).then((result) => {
    return result.rows;
  });
};

const fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Not Found" });
      }
      return rows[0];
    });
};

module.exports = { fetchArticleById, fetchAllArticles };
