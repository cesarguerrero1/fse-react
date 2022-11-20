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
    const findMyTuits = async () => {
        const myTuits = await service.findTuitsByUser("me");
        setTuits(myTuits[1]);
    }
    useEffect(() => {
        findMyTuits()
    }, []);

    const deleteTuit = async (tid) => {
        await service.deleteTuit(tid);
        findMyTuits();
    }

    return(
        <Tuits tuits={tuits} deleteTuit={deleteTuit}/>
    )
}

export default MyTuits;