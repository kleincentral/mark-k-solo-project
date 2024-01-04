import { number } from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewWorld() {
  const allParties = useSelector((store) => store.party);
  const allCharacters = useSelector((store) => store.character);

  let [currentPartyChar, setCurrentPartyChar] = useState([]);
  let [worldName, setWorldName] = useState("");
  let [partyID, setPartyID] = useState(allParties[0].id);

  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    if (partyID) {
      getCharactersFromParty(partyID);
    }
  }, []);

  const postWorld = (event) => {
    event.preventDefault();
    dispatch({
      type: "CREATE_WORLD",
      payload: {
        worldName,
        partyID,
      },
    });
    history.push("/user");
  };

  const toNewParty = (event) => {
    event.preventDefault();
    history.push("/newParty");
  };

  const getCharactersFromParty = (partyId) => {
    partyId = Number(partyId);
    console.log(partyId, allParties);
    let theParty = allParties.find((party) => party.id === partyId);
    let characterIDs = theParty.characters;
    setCurrentPartyChar(characterIDs);
  };

  const handlePartyChange = (event) => {
    setPartyID(event.target.value);
    getCharactersFromParty(event.target.value);
  };

  return (
    <div>
      <h2>Create Your World!</h2>
      <form>
        <input
          value={worldName}
          placeholder="World Name"
          onChange={() => setWorldName(event.target.value)}
        />
        <br></br>
        <select value={partyID} onChange={() => handlePartyChange(event)}>
          {allParties.map((index) => {
            return (
              <option key={index.id} value={index.id}>
                {index.party_name}
              </option>
            );
          })}
        </select>
        <br></br>
        {currentPartyChar.map((index) => {
          return <p>{index}</p>;
        })}
        <button onClick={() => toNewParty(event)}>New Party</button>
        <button onClick={() => postWorld(event)}>Depart</button>
      </form>
    </div>
  );
}

export default NewWorld;
