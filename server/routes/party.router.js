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
    "party".id,
    "worlds".world_name,
    "party".party_name,
    "characters".character_name
  FROM "party"
    LEFT JOIN "worlds"
    ON "worlds".party_id = "party".id
    LEFT JOIN "user"
    ON  "user".id = "party".user_id
    LEFT JOIN "party_character_join"
    ON "party_character_join".party_id = "party".id
    LEFT JOIN "characters"
    ON "party_character_join".character_id = "characters".id
  WHERE "user".id = $1
  ORDER BY "party".id;`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      // console.log(result.rows);

      let newInput = [];
      let i = 0;
      for (index of result.rows) {
        let characterRow = [];
        result.rows.map((index1) => {
          if (index.id === index1.id) {
            characterRow.push(index1.character_name);
          }
        });
        let addToInput = {
          id: index.id,
          world_name: index.world_name,
          party_name: index.party_name,
          characters: [characterRow[0], characterRow[1], characterRow[2]],
        };
        if (
          typeof newInput[0] === "undefined" ||
          addToInput.id != newInput[i - 1].id
        ) {
          // console.log("Success in Input");
          newInput.push(addToInput);
          i++;
        }
      }
      res.send(newInput);
    })
    .catch((err) => {
      console.log("Party get failed: ", err);
      res.sendStatus(500);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
  const party_name = req.body.party_name;
  const char0 = req.body.char0.id;
  const char1 = req.body.char1.id;
  const char2 = req.body.char2.id;

  let queryText = `
    INSERT INTO "party"
      (party_name, user_id)
    VALUES ($1, $2)
    RETURNING "id"`;
  pool
    .query(queryText, [party_name, req.user.id])
    .then((result) => {
      queryText = `
      INSERT INTO "party_character_join"
        (party_id, character_id)
      VALUES ($1, $2)`;
      pool
        .query(queryText, [result.rows[0].id, char0])
        .then(() => {
          pool
            .query(queryText, [result.rows[0].id, char1])
            .then(() => {
              pool
                .query(queryText, [result.rows[0].id, char2])
                .then(() => {
                  res.sendStatus(201);
                })
                .catch((err) => {
                  console.log("POST Party char2 failed: ", err);
                  res.sendStatus(500);
                });
            })
            .catch((err) => {
              console.log("POST Party char1 failed: ", err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.log("POST Party char0 failed: ", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("Party POST failed:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
