import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as likesService from "../../services/likes-service.js";

function Tuits({ tuits = [], deleteTuit, refreshTuits }) {

  const likeTuit = async (tuit) => {
    try {
      await likesService.userTogglesTuitLikes("me", tuit._id);
      refreshTuits();
    } catch (error) {
      alert("You are not allowed to like a Tuit if you are not logged in!");
    }
    return;
  }

  return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit => {
            return (
              <Tuit key={tuit._id} tuit={tuit} deleteTuit={deleteTuit} likeTuit={likeTuit} />
            );
          })
        }
      </ul>
    </div>
  );
}

export default Tuits;