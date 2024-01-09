import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewParty() {
  let [partyMembers, setPartyMember] = useState({
    char0: { character_name: "" },
    char1: { character_name: "" },
    char2: { character_name: "" },
    party_name: "",
  });
  let [selectedChar, setSelectedChar] = useState("");
  // let [ready, setReady] = useState(false);

  const character = useSelector((store) => store.character);

  let dispatch = useDispatch();
  let history = useHistory();

  const postParty = () => {
    // if (ready) {
    dispatch({
      type: "CREATE_PARTY",
      payload: partyMembers,
    });
    setPartyMember({
      char0: { character_name: "" },
      char1: { character_name: "" },
      char2: { character_name: "" },
      party_name: "",
    });
    history.push("/user");
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
      if (
        partyMembers[key].character_name === index.character_name &&
        index.character_name != ""
      ) {
        alert("Cannot have two of the same character in a party!");
        newInput = false;
        break;
      } else if (
        partyMembers[key].character_name === "" ||
        partyMembers[key].character_name === selectedChar
      ) {
        newInput = key;
        break;
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
    // if (
    //   (partyMembers.char0.character != null ||
    //     partyMembers.char0.character != "") &&
    //   (partyMembers.char1.character != null ||
    //     partyMembers.char1.character != "") &&
    //   (partyMembers.char2.character != null ||
    //     partyMembers.char2.character != "")
    // ) {
    //   console.log("Things are filled");
    // }
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
        <label>Name Your Party</label>
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
      <button onClick={() => history.push("/newCharacter")}>
        Create Character
      </button>
      <button onClick={postParty}>Save</button>
    </div>
  );
}

export default NewParty;
