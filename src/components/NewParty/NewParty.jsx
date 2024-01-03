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
  const character = useSelector((store) => store.character);
  let dispatch = useDispatch();
  let history = useHistory();

  const postParty = () => {
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
  };
  // This function first finds if there is a repeating
  // party character. If there isn't, it will add
  // the new character to the party.
  const addToParty = (index) => {
    for (const key in partyMembers) {
      if (partyMembers[key].character_name === index.character_name) {
        alert("Cannot have two of the same character in a party!");
        break;
      } else if (partyMembers[key].character_name === "") {
        setPartyMember((partyMembers) => ({ ...partyMembers, [key]: index }));
        break;
      }
    }
  };

  return (
    <div>
      <h2>Party</h2>
      <li>Character 1: {partyMembers.char0.character_name}</li>
      <li>Character 2: {partyMembers.char1.character_name}</li>
      <li>Character 3: {partyMembers.char2.character_name}</li>
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
      <button onClick={postParty}>Save</button>
    </div>
  );
}

export default NewParty;
