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
    SELECT * FROM "worlds"
    WHERE "worlds".user_id = $1
    ORDER BY "id";`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log("World get failed: ", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
    INSERT INTO "worlds"
      (user_id, world_name, party_id)
    VALUES
    ($1, $2, $3)`;
  pool
    .query(queryText, [req.user.id, req.body.worldName, req.body.partyID])
    .then((result) => res.sendStatus(200))
    .catch((err) => {
      console.log("World POST failed: ", err);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const queryText = `
    UPDATE "worlds"
    SET "world_name" = $1,
        "party_id" = $2
    WHERE "id" = $3;`;
  pool
    .query(queryText, [req.body.worldName, req.body.partyID, req.params.id])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("World PUT failed:", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  const queryText = `
    DELETE FROM "worlds"
    WHERE "id" = $1`;
  pool
    .query(queryText, [req.params.id])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("World DELETE failed:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
