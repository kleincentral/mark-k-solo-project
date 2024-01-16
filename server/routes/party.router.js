const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  // This join is to get the party with their respective characters, since whenever we access a Party we want the
  // characters related to the party.
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
  ORDER BY "party_character_join".id, "worlds".id;`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      // console.log(result.rows);

      let newInput = [];
      let i = 0;
      for (index of result.rows) {
        let characterRow = [];
        result.rows.map((index1) => {
          if (
            (index.world_id === index1.world_id &&
              typeof index.world_id != "object") ||
            (index.id === index1.id && typeof index.world_id === "object")
          ) {
            // console.log(typeof index.world_id);
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
          typeof newInput[0] === "undefined" || // <-- Checks to see if you even have anything to check duplicate info against
          addToInput.id != newInput[i - 1].id // <-- Checking inputs to prevent duplicate information from being added.
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

router.post("/", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    const party_name = req.body.party_name;
    const char0 = req.body.char0.character_id;
    const char1 = req.body.char1.character_id;
    const char2 = req.body.char2.character_id;

    let partyQueryText = `
    INSERT INTO "party"
      (party_name, user_id)
    VALUES ($1, $2)
    RETURNING "id"`;

    let partyCharacterQueryText = `
    INSERT INTO "party_character_join"
      (party_id, character_id)
    VALUES
      ($1, $2),
      ($1, $3),
      ($1, $4)`;

    connection = await pool.connect();
    connection.query("BEGIN;");

    const partyRes = await connection.query(partyQueryText, [
      party_name,
      req.user.id,
    ]);
    const partyCharacterRes = await connection.query(partyCharacterQueryText, [
      partyRes.rows[0].id,
      char0,
      char1,
      char2,
    ]);

    connection.query("COMMIT;");
    connection.release();

    res.sendStatus(201);
  } catch (err) {
    console.log("Error in Party POST:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

router.put("/", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    let partyQuery = `
    UPDATE "party"
    SET "party_name" = $1
    WHERE "id" = $2;`;

    let partyCharacterQuery = `
    UPDATE "party_character_join"
    SET "character_id" = $1
    WHERE "id" = $2;`;

    connection = await pool.connect();
    connection.query("BEGIN;");

    const partyRes = await connection.query(partyQuery, [
      req.body.party_name,
      req.body.party_id,
    ]);

    await connection.query(partyCharacterQuery, [
      req.body.party_characters.character_0_id,
      req.body.party_characters.character_0_joinID,
    ]);
    await connection.query(partyCharacterQuery, [
      req.body.party_characters.character_1_id,
      req.body.party_characters.character_1_joinID,
    ]);
    await connection.query(partyCharacterQuery, [
      req.body.party_characters.character_2_id,
      req.body.party_characters.character_2_joinID,
    ]);
    connection.query("COMMIT;");
    connection.release();

    res.sendStatus(201);
  } catch (err) {
    console.log("Error in Party PUT:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

// Optimal Route with good practice. Change other Routes.
router.delete("/:id", rejectUnauthenticated, async (req, res) => {
  let connection;
  try {
    let partyCharacterQueryText = `
      DELETE FROM "party_character_join"
      WHERE "party_id" = $1;`;

    let worldQueryText = `
      UPDATE "worlds"
      SET "party_id" = NULL
      WHERE "party_id" = $1;`;

    let partyQueryText = `
      DELETE FROM "party"
      WHERE "id" = $1;`;

    // Esablish a longstanding connection with our database:
    connection = await pool.connect();

    // Begin the SQL transaction:
    connection.query("BEGIN;");

    const partyCharacterRes = await connection.query(partyCharacterQueryText, [
      req.params.id,
    ]);
    const worldRes = await connection.query(worldQueryText, [req.params.id]);
    const partyRes = await connection.query(partyQueryText, [req.params.id]);

    connection.query("COMMIT;");
    connection.release();

    res.sendStatus(201);
  } catch (err) {
    console.log("Error in Party DELETE:", err);
    connection.query("ROLLBACK;");
    connection.release();
    res.sendStatus(500);
  }
});

module.exports = router;
