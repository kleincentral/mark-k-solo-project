import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const world = useSelector((store) => store.world);
  const party = useSelector((store) => store.party);
  const character = useSelector((store) => store.character);

  const history = useHistory();

  const credits = () => {
    history.push("/credits");
  };

  const newParty = () => {
    console.log("New Party");
    history.push("/newParty");
  };

  const newChar = () => {
    console.log("New Character");
    history.push("/newCharacter");
  };

  const newWorld = () => {
    console.log("New World");
    // history.push("/about");
  };

  const editCharacter = (id) => {
    console.log("CharacterID:", id);
    // history.push("/about");
  };

  const editParty = (id) => {
    console.log("PartyID:", id);
    // history.push("/about");
  };

  const editWorld = (id) => {
    console.log("WorldID:", id);
    // history.push("/about");
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <button onClick={newParty}>New Party</button>
      {party[0] &&
        party.map((index) => {
          return (
            <li onClick={() => editParty(index.id)}>{index.party_name}</li>
          );
        })}
      <button onClick={newChar}>New Character</button>
      {character[0] &&
        character.map((index) => {
          return (
            <li onClick={() => editCharacter(index.id)}>
              {index.character_name}
            </li>
          );
        })}
      <button onClick={newWorld}>New World</button>
      {world[0] &&
        world.map((index) => {
          return (
            <li onClick={() => editWorld(index.id)}>{index.world_name}</li>
          );
        })}
      <button className="btn" onClick={credits}>
        Credits
      </button>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
