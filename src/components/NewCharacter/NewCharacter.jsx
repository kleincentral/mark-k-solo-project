import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./NewCharacter.css";

function NewCharacter() {
  let [characterName, setCharacterName] = useState("");
  let [characterClass, setCharacterClass] = useState("");
  let [characterBuild, setCharacterBuild] = useState("");

  const classReducer = useSelector((store) => store.classReducer);
  const buildType = useSelector((store) => store.build);

  let dispatch = useDispatch();
  let history = useHistory();

  const postCharacter = (e) => {
    e.preventDefault();
    dispatch({
      type: "CREATE_CHARACTER",
      payload: {
        characterClass,
        characterBuild,
        characterName,
      },
    });
    history.push("/user");
  };
  // This function first finds if there is a repeating
  // party character. If there isn't, it will add
  // the new character to the party.

  const goHome = (e) => {
    e.preventDefault();
    history.push("/user");
  };

  return (
    <div>
      <h2 className="centered">Create A Character</h2>
      <form className="centered characterForm">
        <input
          className="selectInput"
          maxLength={100}
          value={characterName}
          placeholder="Character Name"
          onChange={() => setCharacterName(event.target.value)}
        />
        <br></br>
        <select
          className="selectInput"
          value={characterBuild}
          onChange={() => setCharacterBuild(event.target.value)}
        >
          <option key={0} value="">
            Body Type
          </option>
          {buildType[0] &&
            buildType.map((index) => {
              return (
                <option key={index.id} value={index.id}>
                  {index.build_type}
                </option>
              );
            })}
        </select>
        {/* <input
          value={newCharacterBodyType}
          placeholder='Body Type'
          onChange={() => setCharacterBuild(event.target.value)}
        /> */}
        <br></br>
        <select
          className="selectInput"
          value={characterClass}
          onChange={() => setCharacterClass(event.target.value)}
        >
          <option key={0} value="">
            Classes
          </option>
          {classReducer[0] &&
            classReducer.map((className) => {
              return (
                <option key={className.id} value={className.id}>
                  {className.class_name}
                </option>
              );
            })}
        </select>
        <br></br>
        <div className="characterButtons">
          <button className="mediumButton" onClick={goHome}>
            Home
          </button>
          <button className="mediumButton" onClick={postCharacter}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCharacter;
