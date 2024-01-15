const { fetchAllTopics } = require("../models/topicsModel");

const getAllTopics = (req, res) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

// const getAllTopics = (req, res, next) => {
//   const { sort_by } = req.query;
//   fetchAllTopics(sort_by)
//     .then((allTopics) => {
//       res.status(200).send(allTopics);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

module.exports = { getAllTopics };
