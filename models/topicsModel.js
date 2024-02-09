const db = require("../db/connection");

const fetchAllTopics = (sort_by = "slug") => {
  // this is fully SQL-injection proof!
  const validSortQueries = ["slug", "description"];
  // const validOrderQueries = ["asc", "desc"];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

module.exports = { fetchAllTopics };
