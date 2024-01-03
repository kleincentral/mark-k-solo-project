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
    SELECT * FROM "party"
    WHERE "party".user_id = $1;`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log("Party get failed: ", err);
      res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
  const party_name = req.body.party_name;
  const char0 = req.body.char0.id;
  const char1 = req.body.char1.id;
  const char2 = req.body.char2.id;

  const queryText = `
    INSERT INTO "party"
      (party_name, user_id, character_0_id, character_1_id, character_2_id)
    VALUES ($1, $2, $3, $4, $5)`;
  pool
    .query(queryText, [party_name, req.user.id, char0, char1, char2])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
