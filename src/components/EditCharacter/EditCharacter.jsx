import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function EditCharacter() {
  const currentCharacter = useSelector((store) => store.editReducer);

  let [selectedChar, setSelectedChar] = useState("");
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

  const deleteCharacter = (event) => {
    event.preventDefault();
    dispatch({
      type: "DELETE_CHARACTER",
      payload: currentCharacter.id,
    });
    history.push("/user");
  };

  const goBack = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div>
      <h2>Edit Character</h2>
      <p>Character Name:</p>
      <form>
        <input
          maxLength={100}
          onChange={() => setCharacterName(() => event.target.value)}
          value={characterName}
        />
        <br></br>
        <p>Body Type: {currentCharacter.build_type}</p>
        <p>Class: {currentCharacter.class_name}</p>
        <button onClick={() => goBack(event)}>Back</button>
        <button onClick={() => updateCharacter(event)}>Submit</button>
        <button onClick={() => deleteCharacter(event)}>Delete</button>
      </form>
    </div>
  );
}

export default EditCharacter;
