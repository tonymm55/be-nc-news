# Northcoders News API

## Project Summary

A project building on the backend module of the Northcoders Software Developer Bootcamp. 

The brief was to build an API for the purpose of accessing application data programmatically. The intention here was to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

The database is PostgreSQL (PSQL), and interaction with it is carried out using node-postgres.

The project was separated into tasks that required the building of multiple endpoints that made use of Create Read Update and Delete (CRUD) operations. Endpoints are listed below with the names of the functions passed in as arguments.

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);
app.get("/api/users", getAllUsers);

The project also reinforced GitHub learning by making use of git branching and pull requests for code reviews. Merging of pull requests into the main branch was also performed.

## Web Links

Link to the hosted version on Render https://northcoders-news-ykvv.onrender.com
PostgreSQL database is hosted on ElephantSQL (PostgreSQL as a Service) https://www.elephantsql.com/

## Getting Started

Fork the repo in GitHub and clone using the git clone <filename> command in your terminal. CD into the file you have created and run the following commands:

install node package manager:
install node-postgres: $ npm install pg
install jest
install supertest

To test run the terminal command: npm test
psql
\c nc_news OR \c nc_news_test
SELECT * from articles/comments/topics/users to check the database connection

### Environment Variables

Create two `.env` files in the project root folder: `.env.test` and `.env.development`. Add the following line to each file, replacing "your_database_name" with the correct database name:

PGDATABASE=your_database_name

Ensure that these files are added to your `.gitignore` file to avoid committing sensitive and private information.

### Environment Minimum Version Requirements

The minimum versions required of Node.js and Postgres to run the project:
Node.js (v20.1.0),
PostgreSQL 16.1 on aarch64-apple-darwin21.6.0, compiled by Apple clang version 14.0.0 (clang-1400.0.29.102), 64-bit
