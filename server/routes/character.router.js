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
    SELECT 
      "characters".id,
      "characters".character_name,
      "characters".user_id,
      "class".class_name,
      "build_type".build_type
    FROM "characters"
      LEFT JOIN "class"
      ON "class".id = "characters".class_id
      LEFT JOIN "build_type"
      ON "build_type".id = "characters".build_type_id
    WHERE "characters".user_id = $1
    ORDER BY "characters".id;`;
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

router.put("/", rejectUnauthenticated, (req, res) => {
  let queryText = `
    UPDATE "characters"
    SET "character_name" = $1
    WHERE "id" = $2;`;
  pool
    .query(queryText, [req.body.character_name, req.body.character_id])
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Error in Party PUT:", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  let queryText = `
  UPDATE "party_character_join"
  SET "character_id" = NULL
  WHERE "character_id" = $1;`;

  pool
    .query(queryText, [req.params.id])
    .then((response) => {
      queryText = `
        DELETE FROM "characters"
        WHERE "id" = $1`;
      pool
        .query(queryText, [req.params.id])
        .then((response) => {
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log("Error in Party DELETE:", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("Error in party 'party_character_join' PUT:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
