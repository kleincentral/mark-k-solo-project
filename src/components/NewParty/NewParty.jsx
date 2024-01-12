import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewParty() {
  let [partyMembers, setPartyMember] = useState({
    char0: { character_name: "", character_id: "" },
    char1: { character_name: "", character_id: "" },
    char2: { character_name: "", character_id: "" },
    party_name: "",
  });
  let [selectedChar, setSelectedChar] = useState("");
  // let [ready, setReady] = useState(false);

  const character = useSelector((store) => store.character);

  let dispatch = useDispatch();
  let history = useHistory();

  const postParty = () => {
    // if (ready) {
    if (partyMembers.party_name != "") {
      dispatch({
        type: "CREATE_PARTY",
        payload: partyMembers,
      });
      setPartyMember({
        char0: { character_name: "", character_id: "" },
        char1: { character_name: "", character_id: "" },
        char2: { character_name: "", character_id: "" },
        party_name: "",
      });
      history.push("/user");
    } else {
      alert("Name your party!");
    }
    // }
    // console.log("Not Ready");
  };
  // This function first finds if there is a repeating
  // party character. If there isn't, it will add
  // the new character to the party.
  const addToParty = (index) => {
    // console.log(index);
    let newInput = false;
    for (const key in partyMembers) {
      if (partyMembers[key].character_id === index.id && index.id != "") {
        alert("Cannot have two of the same character in a party!");
        newInput = false;
        console.log(
          index.character_id,
          partyMembers[key].character_id,
          index.character_name,
          partyMembers[key].character_name
        );
        break;
      } else if (
        partyMembers[key].character_id === "" ||
        partyMembers[key].character_id === selectedChar ||
        typeof partyMembers[key].character_id === "object"
      ) {
        if (!newInput) {
          newInput = key;
          console.log(
            index.character_id,
            partyMembers[key].character_id,
            index.character_name,
            partyMembers[key].character_name
          );
        }
      }
    }
    if (newInput) {
      const newObj = {
        party_character_join_id: partyMembers[newInput].party_character_join_id,
        character_id: index.id,
        character_name: index.character_name,
      };
      // console.log("NewObject", newObj);
      setPartyMember((partyMembers) => ({
        ...partyMembers,
        [newInput]: newObj,
      }));
      // console.log("Party Members is now", partyMembers);
      setSelectedChar("");
      clearRed();
    }
  };

  const swapCharSelectCurrent = (index, charID) => {
    // console.log("index", index, "characterID", charID);
    clearRed();
    document
      .getElementById(`${index}Edit`)
      .classList.add("selectedPartyMember");
    setSelectedChar(charID);
  };

  const clearRed = () => {
    document
      .getElementById(`char0Edit`)
      .classList.remove("selectedPartyMember");
    document
      .getElementById(`char1Edit`)
      .classList.remove("selectedPartyMember");
    document
      .getElementById(`char2Edit`)
      .classList.remove("selectedPartyMember");
  };

  const remove = () => {
    // console.log("Remove", selectedChar);
    if (partyMembers.char0.character_id === selectedChar) {
      partyMembers.char0.character_name = "";
      partyMembers.char0.character_id = null;
    } else if (partyMembers.char1.character_id === selectedChar) {
      partyMembers.char1.character_name = "";
      partyMembers.char1.character_id = null;
    } else if (partyMembers.char2.character_id === selectedChar) {
      partyMembers.char2.character_name = "";
      partyMembers.char2.character_id = null;
    }
    addToParty({ id: "" });
  };

  const deselect = () => {
    clearRed();
    setSelectedChar("");
  };

  return (
    <div>
      <div className="flexBoxUserPage">
        <div className="flexItemUserPage gry">
          <h2>Party</h2>
          <p
            id="char0Edit"
            onClick={() =>
              swapCharSelectCurrent("char0", partyMembers.char0.character_id)
            }
          >
            Character 1: {partyMembers.char0.character_name}
          </p>
          <p
            id="char1Edit"
            onClick={() =>
              swapCharSelectCurrent("char1", partyMembers.char1.character_id)
            }
          >
            Character 2: {partyMembers.char1.character_name}
          </p>
          <p
            id="char2Edit"
            onClick={() =>
              swapCharSelectCurrent("char2", partyMembers.char2.character_id)
            }
          >
            Character 3: {partyMembers.char2.character_name}
          </p>
          {selectedChar != "" && (
            <div>
              <button className="longButton" onClick={remove}>
                Remove Character
              </button>
              <button className="longButton" onClick={deselect}>
                Deselect
              </button>
            </div>
          )}
        </div>
        <div className="flexItemUserPage gry">
          <h2>Characters</h2>
          {character[0] &&
            character.map((index) => {
              return (
                <p key={index.id} onClick={() => addToParty(index)}>
                  {index.character_name}
                </p>
              );
            })}
          <h4>Name Your Party</h4>
          <input
            maxLength={50}
            onChange={() =>
              setPartyMember((partyMembers) => ({
                ...partyMembers,
                party_name: event.target.value,
              }))
            }
            value={partyMembers.party_name}
          />
        </div>
      </div>
      <footer>
        <button className="mediumButton" onClick={() => history.push("/user")}>
          Home
        </button>
        <button
          className="mediumButton"
          onClick={() => history.push("/newCharacter")}
        >
          Create Character
        </button>
        <button className="mediumButton" onClick={postParty}>
          Save
        </button>
      </footer>
    </div>
  );
}

export default NewParty;
