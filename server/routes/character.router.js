const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back world object from the session (previously queried from the database)
  const queryText = `
    SELECT * FROM "characters"
    WHERE "characters".user_id = $1;`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log("Character get failed: ", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
  INSERT INTO "characters"
    (character_name, user_id, class_id, build_type_id)
  VALUES
    ($1, $2, $3, $4)`;
  pool
    .query(queryText, [
      req.body.characterName,
      req.user.id,
      req.body.characterClass,
      req.body.characterBuild,
    ])
    .then((result) => res.sendStatus(201))
    .catch((err) => {
      console.log("Character POST failed:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
