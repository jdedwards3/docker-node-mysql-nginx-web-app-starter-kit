const mysql = require("mysql");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const knex = require("knex")({
  client: "mysql",
  connection: dbConfig,
});

const connection = mysql.createConnection(dbConfig);

const db = { knex, connection };

module.exports = db;
