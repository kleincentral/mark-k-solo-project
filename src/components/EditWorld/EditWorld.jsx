import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function EditWorld() {
  const allParties = useSelector((store) => store.party);
  const currentParty = useSelector((store) => store.editReducer);

  let [currentPartyChar, setCurrentPartyChar] = useState([]);
  let [worldName, setWorldName] = useState(currentParty.world_name);
  let [partyID, setPartyID] = useState(currentParty.party_id);
  let [deletedParty, setDeletedParty] = useState(false);

  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    if (partyID) {
      getCharactersFromParty(partyID);
    } else {
      setDeletedParty(true);
      getCharactersFromParty(allParties[0].id);
    }
  }, []);

  const postWorld = (event) => {
    event.preventDefault();
    dispatch({
      type: "EDIT_WORLD",
      payload: {
        worldName,
        partyID,
        currentWorldID: currentParty.id,
      },
    });
    history.push("/user");
  };

  const deleteWorld = (event) => {
    event.preventDefault();
    dispatch({
      type: "DELETE_WORLD",
      payload: currentParty.id,
    });
    history.push("/user");
  };

  const goBack = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const getCharactersFromParty = (partyId) => {
    partyId = Number(partyId);
    // console.log(partyId, allParties);
    let theParty = allParties.find((party) => party.id === partyId);
    let characterIDs = theParty.characters;
    // console.log(characterIDs);
    setCurrentPartyChar(characterIDs);
  };

  const handlePartyChange = (event) => {
    setDeletedParty(false);
    setPartyID(event.target.value);
    getCharactersFromParty(event.target.value);
  };

  return (
    <div>
      <h2>Do you want to load this World?</h2>
      {deletedParty && (
        <h3>
          The party which was in {worldName} no longer exists! Select a new
          party, or proceed with the filled in party.
        </h3>
      )}
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
          return <p>{index.charactername}</p>;
        })}
        <button onClick={() => goBack(event)}>Back</button>
        <button onClick={() => postWorld(event)}>Depart</button>
        <button onClick={() => deleteWorld(event)}>Delete World</button>
      </form>
    </div>
  );
}

export default EditWorld;
