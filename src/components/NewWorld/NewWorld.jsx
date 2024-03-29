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
    // console.log(partyID);
    if (allParties[0]) {
      getCharactersFromParty(allParties[0].id);
      setPartyID(allParties[0].id);
    } else {
      setAnyParties(false);
    }
  }, []);

  const postWorld = (event) => {
    event.preventDefault();
    if (worldName != "") {
      dispatch({
        type: "CREATE_WORLD",
        payload: {
          worldName,
          partyID,
        },
      });
      history.push("/user");
    } else {
      alert("Add a world name!");
    }
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

  const editSelectedParty = (e) => {
    e.preventDefault();
    // console.log("Edit Selected Party", partyID);
    let theParty = allParties.find((party) => party.id === Number(partyID));
    // console.log(theParty);
    dispatch({
      type: "SET_EDIT",
      payload: theParty,
    });
    history.push("/editParty");
  };

  return (
    <div>
      <h2 className="centered">Create Your World!</h2>
      {!anyParties && (
        <div className="centered">
          <h3>
            It seems like you don't have any parties, would you like to go and
            create one?
          </h3>
          <br></br>
          <button className="longButton" onClick={() => history.goBack()}>
            Back
          </button>
          <button
            className="longButton"
            onClick={() => history.push("/newParty")}
          >
            Create a New Party
          </button>
        </div>
      )}
      {anyParties && (
        <form className="centered characterForm">
          <input
            className="selectInput"
            maxLength={100}
            value={worldName}
            placeholder="World Name"
            onChange={() => setWorldName(event.target.value)}
          />
          <br></br>
          <select
            className="selectInput"
            value={partyID}
            onChange={() => handlePartyChange(event)}
          >
            {allParties.map((index) => {
              return (
                <option key={index.id} value={index.id}>
                  {index.party_name}
                </option>
              );
            })}
          </select>
          <br></br>
          {currentPartyChar[0] &&
            !currentPartyChar[0].characterid &&
            !currentPartyChar[1].characterid &&
            !currentPartyChar[0].characterid && (
              <h5>
                Your party doesn't seem to have any characters in it, go add
                some!
              </h5>
            )}
          {currentPartyChar.map((index) => {
            return <p>{index.charactername}</p>;
          })}
          <button
            className="mediumButton"
            onClick={() => history.push("/user")}
          >
            Home
          </button>
          {(currentPartyChar[0] &&
            !currentPartyChar[0].characterid &&
            !currentPartyChar[1].characterid &&
            !currentPartyChar[0].characterid && (
              <button className="mediumButton" onClick={editSelectedParty}>
                Edit This Party
              </button>
            )) || (
            <button
              id="departButton"
              className="mediumButton"
              onClick={() => postWorld(event)}
            >
              Depart
            </button>
          )}
          <button className="mediumButton" onClick={() => toNewParty(event)}>
            New Party
          </button>
        </form>
      )}
    </div>
  );
}

export default NewWorld;
