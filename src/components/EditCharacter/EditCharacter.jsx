import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function EditCharacter() {
  const currentCharacter = useSelector((store) => store.editReducer);

  let [characterName, setCharacterName] = useState(
    currentCharacter.character_name
  );

  let dispatch = useDispatch();
  let history = useHistory();

  const updateCharacter = (event) => {
    event.preventDefault();
    dispatch({
      type: "UPDATE_CHARACTER",
      payload: {
        character_id: currentCharacter.id,
        character_name: characterName,
      },
    });
    history.push("/user");
  };

  return (
    <div>
      <h2>Edit Character</h2>
      <p>Character Name:</p>
      <form>
        <input
          onChange={() => setCharacterName(() => event.target.value)}
          value={characterName}
        />
        <br></br>
        <button onClick={() => updateCharacter(event)}>Submit</button>
      </form>
    </div>
  );
}

export default EditCharacter;
