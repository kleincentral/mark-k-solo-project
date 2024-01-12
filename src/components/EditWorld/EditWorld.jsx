import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./EditWorld.css";

function EditWorld() {
  const allParties = useSelector((store) => store.party);
  const currentParty = useSelector((store) => store.editReducer);

  let [currentPartyChar, setCurrentPartyChar] = useState([]);
  let [worldName, setWorldName] = useState(currentParty.world_name);
  let [partyID, setPartyID] = useState(currentParty.party_id);
  let [deletedParty, setDeletedParty] = useState(false);
  let [anyParties, setAnyParties] = useState(true);

  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    if (partyID) {
      getCharactersFromParty(partyID);
    } else {
      setDeletedParty(true);
      if (allParties[0]) {
        getCharactersFromParty(allParties[0].id);
        setPartyID(allParties[0].id);
      } else {
        setAnyParties(false);
      }
    }
  }, []);

  const postWorld = (event) => {
    event.preventDefault();
    if (worldName != "") {
      dispatch({
        type: "EDIT_WORLD",
        payload: {
          worldName,
          partyID,
          currentWorldID: currentParty.id,
        },
      });
      history.push("/user");
    } else {
      alert("Name your world!");
    }
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
    history.push("/user");
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
      <div>
        <h2 className="centered">Do you want to load this World?</h2>
        {deletedParty && (
          <h3 className="warningText centered">
            The party which was in "{worldName}" no longer exists! Select a new
            party, or proceed with the filled in party.
          </h3>
        )}
        {!anyParties && (
          <div className="centered">
            <h4>
              It seems like you don't have any parties, would you like to go and
              create one?
            </h4>
            <button className="longButton" onClick={() => history.goBack()}>
              Back
            </button>
            <button
              className="longButton"
              onClick={() => history.push("/newParty")}
            >
              Create a New Party
            </button>
            <button className="longButton" onClick={() => deleteWorld(event)}>
              Delete World
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
              onChange={handlePartyChange}
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
            <button className="mediumButton" onClick={() => goBack(event)}>
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
            <button className="mediumButton" onClick={() => deleteWorld(event)}>
              Delete World
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditWorld;
