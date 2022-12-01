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
 * our user has liked and we will return those to the page.
 * @returns - JSX element with Tuits our user has liked
 */
function MyLikes(){
    const [likedTuits, setLikedTuits] = useState([]);

    async function findTuitsILike(){
        const likeRecords = await likesDislikesService.findAllTuitsLikedByUser("me");

        //Curate the records
        const tuits = likeRecords.map((record) => {
            record.tuit.liked=true;
            return record.tuit;
        })

        setLikedTuits(tuits);

    }

    //Wait for the page to render so we can insert the Tuits appropriately
    useEffect(() => {
        findTuitsILike()
    }, [])

    return(
        <div>
            <Tuits tuits={likedTuits} refreshTuits={findTuitsILike}/>
        </div>
    )
}

export default MyLikes;