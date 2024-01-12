import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./EditCharacter.css";

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
    if (characterName != "") {
      dispatch({
        type: "UPDATE_CHARACTER",
        payload: {
          character_id: currentCharacter.id,
          character_name: characterName,
        },
      });
      history.push("/user");
    } else {
      alert("Please Add a character name!");
    }
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
    history.push("/user");
  };

  return (
    <div>
      <h1 className="centered">Edit Character</h1>
      <div className="flexBoxUserPage">
        <div className="flexItemUserPage gry">
          <p>Character Name:</p>
          <input
            maxLength={100}
            onChange={() => setCharacterName(() => event.target.value)}
            value={characterName}
          />
          <p>Body Type: {currentCharacter.build_id}</p>
          <p>Class: {currentCharacter.class_name}</p>
        </div>
        <div className="flexItemUserPage gry">
          <p>Inventory:</p>
          {/* Write out inventory mapping after inventory gets made*/}
        </div>
        <div className="gry mrgn">
          <p>Equipped Items:</p>
          {/* Write out equipment mapping after inventory gets made.
          Functionality needs to be added to swap equipped items here too.*/}
        </div>
      </div>
      <footer className="centered">
        <button className="longButton" onClick={() => goBack(event)}>
          Home
        </button>
        <button className="longButton" onClick={() => updateCharacter(event)}>
          Submit
        </button>
        <button className="longButton" onClick={() => deleteCharacter(event)}>
          Delete
        </button>
      </footer>
    </div>
  );
}

export default EditCharacter;
