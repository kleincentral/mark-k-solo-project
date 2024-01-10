import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewWorld() {
  const allParties = useSelector((store) => store.party);
  const allCharacters = useSelector((store) => store.character);

  let [currentPartyChar, setCurrentPartyChar] = useState([]);
  let [worldName, setWorldName] = useState("");
  let [partyID, setPartyID] = useState("");
  let [anyParties, setAnyParties] = useState(true);

  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    console.log(partyID);
    if (allParties[0]) {
      getCharactersFromParty(allParties[0].id);
      setPartyID(allParties[0].id);
    } else {
      setAnyParties(false);
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
    // console.log(partyId, allParties);
    let theParty = allParties.find((party) => party.id === partyId);
    let characterIDs = theParty.characters;
    // console.log(characterIDs);
    setCurrentPartyChar(characterIDs);
  };

  const handlePartyChange = (event) => {
    setPartyID(event.target.value);
    getCharactersFromParty(event.target.value);
  };

  return (
    <div>
      <h2>Create Your World!</h2>
      {!anyParties && (
        <div>
          <h4>
            It seems like you don't have any parties, would you like to go and
            create one?
          </h4>
          <button onClick={() => history.goBack()}>Back</button>
          <button onClick={() => history.push("/newParty")}>
            Create a New Party
          </button>
        </div>
      )}
      {anyParties && (
        <form>
          <input
            maxLength={100}
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
          <button onClick={() => toNewParty(event)}>New Party</button>
          <button onClick={() => postWorld(event)}>Depart</button>
        </form>
      )}
    </div>
  );
}

export default NewWorld;
