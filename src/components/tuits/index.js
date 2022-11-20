import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as likesService from "../../services/likes-service.js";

function Tuits({tuits = [], deleteTuit, refreshTuits}) {

    const likeTuit = (tuit) => {
        likesService.userTogglesTuitLikes("me", tuit._id).then(refreshTuits).catch((error) => alert(error));
    }

    return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit => {
            return (
                <Tuit key={tuit._id} deleteTuit={deleteTuit} likeTuit={likeTuit} tuit={tuit}/>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Tuits;