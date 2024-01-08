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
    "worlds".id as world_id,
    "worlds".world_name,
    "party".party_name,
    "party_character_join".id as "party_join_id",
    "characters".character_name,
    "characters".id as "character_id"
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
  ORDER BY "party_character_join".id;`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      // console.log(result.rows);

      let newInput = [];
      let i = 0;
      for (index of result.rows) {
        let characterRow = [];
        result.rows.map((index1) => {
          if (index.world_id === index1.world_id) {
            characterRow.push({
              party_character_join_id: index1.party_join_id,
              characterid: index1.character_id,
              charactername: index1.character_name,
            });
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

router.put("/", rejectUnauthenticated, (req, res) => {
  let queryText = `
    UPDATE "party"
    SET "party_name" = $1
    WHERE "id" = $2;`;
  pool
    .query(queryText, [req.body.party_name, req.body.party_id])
    .then((response) => {
      queryText = `
      UPDATE "party_character_join"
      SET "character_id" = $1
      WHERE "id" = $2;`;
      pool
        .query(queryText, [
          req.body.party_characters.character_0_id,
          req.body.party_characters.character_0_joinID,
        ])
        .then((response) => {
          // console.log("First Update complete!");
          pool
            .query(queryText, [
              req.body.party_characters.character_1_id,
              req.body.party_characters.character_1_joinID,
            ])
            .then((response) => {
              // console.log("Second Update complete!");
              pool
                .query(queryText, [
                  req.body.party_characters.character_2_id,
                  req.body.party_characters.character_2_joinID,
                ])
                .then((response) => {
                  // console.log("Last Update complete!");
                  // console.log("Party Updated");
                  res.sendStatus(201);
                })
                .catch((err) => {
                  console.log("Error in party_character_join final PUT", err);
                });
            })
            .catch((err) => {
              console.log("Error in party_character_join second PUT", err);
            });
        })
        .catch((err) => {
          console.log("Error in party_character_join first PUT", err);
        });
    })
    .catch((err) => {
      console.log("Error in Party PUT:", err);
      res.sendStatus(500);
    });
});

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  let queryText = `
    DELETE FROM "party_character_join"
    WHERE "party_id" = $1
  `;
  pool
    .query(queryText, [req.params.id])
    .then((response) => {
      queryText = `
      UPDATE "worlds"
      SET "party_id" = NULL
      WHERE "party_id" = $1;`;
      pool
        .query(queryText, [req.params.id])
        .then((response) => {
          queryText = `
          DELETE FROM "party"
          WHERE "id" = $1;`;
          pool
            .query(queryText, [req.params.id])
            .then((response) => {
              res.sendStatus(201);
            })
            .catch((err) => {
              console.log("Error in Party DELETE 'party':", err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.log("Error in Party DELETE 'party':", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("Error in Party DELETE 'party_character_join':", err);
      res.sendStatus(500);
    });
});

module.exports = router;
