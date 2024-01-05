import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./EditParty.css";

function EditParty() {
  const character = useSelector((store) => store.character);
  const currentParty = useSelector((store) => store.editReducer);

  let [selectedChar, setSelectedChar] = useState("");
  let [partyMembers, setPartyMember] = useState({
    char0: {
      party_character_join_id:
        currentParty.characters[0].party_character_join_id,
      character_id: currentParty.characters[0].characterid,
      character_name: currentParty.characters[0].charactername,
    },
    char1: {
      party_character_join_id:
        currentParty.characters[1].party_character_join_id,
      character_id: currentParty.characters[1].characterid,
      character_name: currentParty.characters[1].charactername,
    },
    char2: {
      party_character_join_id:
        currentParty.characters[2].party_character_join_id,
      character_id: currentParty.characters[2].characterid,
      character_name: currentParty.characters[2].charactername,
    },
    party_name: currentParty.party_name,
    party_id: currentParty.id,
  });

  let dispatch = useDispatch();
  let history = useHistory();

  const editParty = () => {
    dispatch({
      type: "EDIT_PARTY",
      payload: [
        partyMembers.party_id,
        partyMembers.party_name,
        partyMembers.char0.character_name,
      ],
    });
    setPartyMember({
      char0: { character_id: "", character_name: "" },
      char1: { character_id: "", character_name: "" },
      char2: { character_id: "", character_name: "" },
      party_name: "",
      party_id: "",
    });
    history.push("/user");
  };
  // This function first finds if there is a repeating
  // party character. If there isn't, it will add
  // the new character to the party.
  const addToParty = (index) => {
    for (const key in partyMembers) {
      if (partyMembers[key].character_name === index.character_name) {
        alert("Cannot have two of the same character in a party!");
        break;
      } else if (
        partyMembers[key].character_name === "" ||
        partyMembers[key].character_name === selectedChar
      ) {
        setPartyMember((partyMembers) => ({ ...partyMembers, [key]: index }));
        break;
      }
    }
  };

  const deleteParty = () => {
    console.log("Delete GO!");
    console.log(partyMembers);
  };

  const swapCharSelectCurrent = (index, charID) => {
    console.log("index", index, "characterID", charID);
    document
      .getElementById(`${index}Edit`)
      .classList.add("selectedPartyMember");
    setSelectedChar(charID);
  };

  return (
    <div>
      <h2>Party</h2>
      <li
        id="char0Edit"
        onClick={() =>
          swapCharSelectCurrent("char0", partyMembers.char0.character_name)
        }
      >
        Character 1: {partyMembers.char0.character_name}
      </li>
      <li
        id="char1Edit"
        onClick={() =>
          swapCharSelectCurrent("char1", partyMembers.char1.character_name)
        }
      >
        Character 2: {partyMembers.char1.character_name}
      </li>
      <li
        id="char2Edit"
        onClick={() =>
          swapCharSelectCurrent("char2", partyMembers.char2.character_name)
        }
      >
        Character 3: {partyMembers.char2.character_name}
      </li>
      <h2>Characters</h2>
      {character[0] &&
        character.map((index) => {
          return (
            <li key={index.id} onClick={() => addToParty(index)}>
              {index.character_name}
            </li>
          );
        })}

      <form>
        <label>Party Name</label>
        <input
          onChange={() =>
            setPartyMember((partyMembers) => ({
              ...partyMembers,
              party_name: event.target.value,
            }))
          }
          value={partyMembers.party_name}
        />
      </form>
      <button onClick={() => history.goBack()}>Back</button>
      <button onClick={editParty}>Save</button>
      <button onClick={deleteParty}>Delete</button>
    </div>
  );
}

export default EditParty;
