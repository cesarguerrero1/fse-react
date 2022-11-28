/*
* Cesar Guerrero
* 11/19/22
* CS5500 - Fall 2022
* 
* Assignment 4
*/

import {useEffect, useState} from "react";
import * as service from "../../services/tuits-service.js";
import Tuits from "../tuits/index.js";

function MyTuits(){
    const [tuits, setTuits] = useState([]);

    async function findMyTuits(){
        const myTuits = await service.findTuitsByUser("me");
        //Our request is returning an array with a response string and and array of the tuits if they exist
        setTuits(myTuits[1]);
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