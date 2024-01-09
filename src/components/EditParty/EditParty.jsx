import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./EditParty.css";

function EditParty() {
  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    dispatch({
      type: "FETCH_USER_ALLINFO",
    });
    console.log("partyMembers", partyMembers);
  }, []);

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

  const editParty = () => {
    dispatch({
      type: "EDIT_PARTY",
      payload: {
        party_id: partyMembers.party_id,
        party_name: partyMembers.party_name,
        party_characters: {
          character_0_id: partyMembers.char0.character_id,
          character_0_joinID: partyMembers.char0.party_character_join_id,
          character_1_id: partyMembers.char1.character_id,
          character_1_joinID: partyMembers.char1.party_character_join_id,
          character_2_id: partyMembers.char2.character_id,
          character_2_joinID: partyMembers.char2.party_character_join_id,
        },
      },
    });
    history.push("/user");
  };
  // This function first finds if there is a repeating
  // party character. If there isn't, it will add
  // the new character to the party.
  const addToParty = (index) => {
    console.log(index);
    let newInput = false;
    for (const key in partyMembers) {
      if (
        partyMembers[key].character_name === index.character_name &&
        index.character_name != ""
      ) {
        alert("Cannot have two of the same character in a party!");
        newInput = false;
        break;
      } else if (
        partyMembers[key].character_name === "" ||
        partyMembers[key].character_name === selectedChar ||
        typeof partyMembers[key].character_name === "object"
      ) {
        newInput = key;
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
    if (partyMembers.char0.character_name === selectedChar) {
      partyMembers.char0.character_name = "";
    } else if (partyMembers.char1.character_name === selectedChar) {
      partyMembers.char1.character_name = "";
    } else if (partyMembers.char2.character_name === selectedChar) {
      partyMembers.char2.character_name = "";
    }
    addToParty({ character_name: "" });
  };

  const deleteParty = () => {
    console.log("Delete GO!");
    console.log(partyMembers.party_id);
    //write delete here
    dispatch({
      type: "DELETE_PARTY",
      payload: partyMembers.party_id,
    });
    history.push("/user");
  };

  return (
    <div>
      <h2>Edit Party</h2>
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
      {selectedChar != "" && <button onClick={remove}>Remove Character</button>}
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
          maxLength={50}
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
