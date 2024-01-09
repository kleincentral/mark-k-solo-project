import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewCharacter() {
  let [characterName, setCharacterName] = useState("");
  let [characterClass, setCharacterClass] = useState("");
  let [characterBuild, setCharacterBuild] = useState("");

  const classReducer = useSelector((store) => store.classReducer);
  const buildType = useSelector((store) => store.build);

  let dispatch = useDispatch();
  let history = useHistory();

  const postCharacter = (event) => {
    event.preventDefault();
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

  return (
    <div>
      <h2>Create A Character</h2>
      <form>
        <input
          maxLength={100}
          value={characterName}
          placeholder="Character Name"
          onChange={() => setCharacterName(event.target.value)}
        />
        <br></br>
        <select
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
        <button onClick={() => postCharacter(event)}>Submit</button>
      </form>
    </div>
  );
}

export default NewCharacter;
