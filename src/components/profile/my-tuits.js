/*
* Cesar Guerrero
* 11/19/22
* CS5500 - Fall 2022
* 
* Assignment 4
*/

import {useEffect, useState} from "react";
import * as service from "../../services/tuits-service.js";
import * as likesDislikesService from "../../services/likes-dislikes-service.js";
import Tuits from "../tuits/index.js";

function MyTuits(){
    const [tuits, setTuits] = useState([]);

    async function findMyTuits(){
        const myTuits = await service.findTuitsByUser("me");

        //Grab all of the users likes and dislikes so we can highlight appropriately
        const usersLikedTuits = await likesDislikesService.findAllTuitsLikedByUser("me");
        const usersDislikedTuits = await likesDislikesService.findAllTuitsDislikedByUser("me");

        //We have to loop through all of the Likes
        for(let j = 0; j < usersLikedTuits.length; j++){
            const tid = usersLikedTuits[j].tuit._id;
            //Loop over every Tuit that will be displayed
            for(let i = 0; i < myTuits.length; i++){
              if(myTuits[i]._id === tid){
                myTuits[i].liked = true;
              }
            }
          }
          
    
          //We have to loop through all of the Dislikes
          for(let j=0; j < usersDislikedTuits.length; j++){
            const tid = usersDislikedTuits[j].tuit._id;
            //Loop over every Tuit that will be displayed
            for(let i = 0; i < myTuits.length; i++){
              if(myTuits[i]._id === tid){
                myTuits[i].disliked = true;
              }
            }
          }

        //Our request is returning an array with a response string and and array of the tuits if they exist
        setTuits(myTuits);
    }

    async function deleteTuit(tid){
        await service.deleteTuit(tid);
        findMyTuits();
    }

    useEffect(() => {
        findMyTuits()
    }, []);

    return(
        <Tuits tuits={tuits} deleteTuit={deleteTuit} refreshTuits={findMyTuits}/>
    )
}

export default MyTuits;