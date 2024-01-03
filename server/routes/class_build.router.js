const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/build", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT * FROM "build_type"`;
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log("Build get failed: ", err);
      res.sendStatus(500);
    });
});

router.get("/class", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT * FROM "class"`;
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log("Class get failed: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
