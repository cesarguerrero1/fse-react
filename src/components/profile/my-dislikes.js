/*
Cesar Guerrero
12/01/22
CS5500 - Fall 2022

Assignment 4

*/

import {useEffect, useState} from "react";
import * as likesDislikesService from "../../services/likes-dislikes-service.js"
import Tuits from "../tuits/index.js"

/**
 * This is a JSX function that will return the HTML for our page. We are querying the server for all the tuits that
 * our user has disliked and we will return those to the page.
 * @returns - JSX element with Tuits our user has disliked
 */
function MyDislikes(){
    const [dislikedTuits, setDislikedTuits] = useState([]);

    //This function will ping the server for all tuits our user has ever disliked
    async function findTuitsIDislike(){
        const dislikeRecords = await likesDislikesService.findAllTuitsDislikedByUser("me");
        //Curate records
        const tuits = dislikeRecords.map((record) => {
            record.tuit.disliked=true;
            return record.tuit;
        })
        setDislikedTuits(tuits);
    }

    useEffect(() => {
        findTuitsIDislike()
    }, [])

    return(
        <div>
            <Tuits tuits={dislikedTuits} refreshTuits={findTuitsIDislike}/>
        </div>
    )
}

export default MyDislikes;