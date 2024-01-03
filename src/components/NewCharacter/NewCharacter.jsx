import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
 

function NewCharacter() {
  let [newCharacterName, setCharacterName] = useState('')
  let [newCharacterBodyType, setCharacterBodyType] = useState('')
  let [characterClass, setCharacterClass] = useState('')
  const character = useSelector((store) => store.character);
  let dispatch = useDispatch()
  let history = useHistory()

  const postCharacter = (event) => {
    event.preventDefault
    dispatch({
      type: "CREATE_PARTY",
      payload: 's'
    })
    history.push('/user')
  }
  // This function first finds if there is a repeating 
  // party character. If there isn't, it will add
  // the new character to the party.
  

  return (
    <div>
      <h2>Create A Character</h2>
      <form>
        <input
          value={newCharacterName}
          placeholder='Character Name'
          onChange={() => setCharacterName(event.target.value)}
        />
        <br></br>
        <input
          value={newCharacterBodyType}
          placeholder='Body Type'
          onChange={() => setCharacterBodyType(event.target.value)}
        />
        <br></br>
        <input
          value={newCharacterBodyType}
          placeholder='Class'
          onChange={() => setCharacterBodyType(event.target.value)}
        />
        <br></br>
        <button onClick={() => postCharacter(event)}>Submit</button>
      </form>
    </div>
  );
}

export default NewCharacter;
