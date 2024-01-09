import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./UserPage.css";

function UserPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "FETCH_USER_ALLINFO",
    });
  }, []);

  const user = useSelector((store) => store.user);
  const world = useSelector((store) => store.world);
  const party = useSelector((store) => store.party);
  const character = useSelector((store) => store.character);

  const credits = () => {
    history.push("/credits");
  };

  const newParty = () => {
    history.push("/newParty");
  };

  const newChar = () => {
    history.push("/newCharacter");
  };

  const newWorld = () => {
    history.push("/newWorld");
  };

  const editCharacter = (info) => {
    console.log("CharacterID:", info);
    dispatch({
      type: "SET_EDIT",
      payload: info,
    });
    history.push("/editCharacter");
  };

  const editParty = (info) => {
    console.log("PartyInfo:", info);
    dispatch({
      type: "SET_EDIT",
      payload: info,
    });
    history.push("/editParty");
  };

  const editWorld = (info) => {
    console.log("WorldID:", info);
    dispatch({
      type: "SET_EDIT",
      payload: info,
    });
    history.push("/editWorld");
  };

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      {/* <p>Your ID is: {user.id}</p> */}
      <div className="flexBoxUserPage">
        <div className="flexItemUserPage">
          <button onClick={newParty}>New Party</button>
          {party[0] &&
            party.map((index) => {
              return (
                <li onClick={() => editParty(index)}>{index.party_name}</li>
              );
            })}
        </div>
        <div className="flexItemUserPage">
          <button onClick={newChar}>New Character</button>
          {character[0] &&
            character.map((index) => {
              return (
                <li onClick={() => editCharacter(index)}>
                  {index.character_name}
                </li>
              );
            })}
        </div>
        <div className="flexItemUserPage">
          <button onClick={newWorld}>New World</button>
          {world[0] &&
            world.map((index) => {
              return (
                <li onClick={() => editWorld(index)}>{index.world_name}</li>
              );
            })}
        </div>
      </div>
      <div className="creditsbtn">
        <button className="btn" onClick={credits}>
          Credits
        </button>
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
