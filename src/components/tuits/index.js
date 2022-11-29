import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as likesService from "../../services/likes-service.js";

function Tuits({ tuits = [], deleteTuit, refreshTuits }) {

  //Essentially what we are doing is handling a like event and then checking it if is a 'like' or 'dislike' event
  const handleLikeEvent = async(tuit, eventType) => {
      try{
        await likesService.userTogglesLikeEvent("me", tuit._id, eventType);
        refreshTuits();
      }catch(error){
        alert("You are not allowed to like or dislike a Tuit if you are not logged in!");
      }
  }

  return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit => {
            return (
              <Tuit key={tuit._id} tuit={tuit} deleteTuit={deleteTuit} handleLikeEvent={handleLikeEvent}/>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Tuits;