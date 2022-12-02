/*
* Cesar Guerrero
* 11/20/22
* CS5500 - Fall 2022
* 
* Assignment 4
*/

import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE;

const USERS_API = `${BASE_URL}/users`;

const api = axios.create({
    withCredentials: true
});

/**
 * When a user likes a Tuit, we need to make a call to the server to update the database accordingly
 * @param {string} uid - The ID of the person who liked the Tuit
 * @param {string} tid - The ID of the Tuit that was liked
 * @returns This will return a response status of 200 (SUCCESS), 403 (FORBIDDEN), 404 (NOT FOUND)
 */
async function userTogglesLikeEvent(uid, tid){
    const response = await api.put(`${USERS_API}/${uid}/likes/${tid}`);
    return response.data
}

/**
 * When a user dislikes a Tuit, we need to make a call to the server to update the database accordingly
 * @param {string} uid - The ID of the person who disliked the Tuit
 * @param {string} tid - The ID of the Tuit that was disliked
 * @returns {ResponseStatus} This will return a response status of 200 (SUCCESS), 403 (FORBIDDEN), 404 (NOT FOUND)
 */
 async function userTogglesDislikeEvent(uid, tid){
    const response = await api.put(`${USERS_API}/${uid}/dislikes/${tid}`);
    return response.data
}

/**
 * When called this function will attempt to find all the Tuits a user has liked
 * @param {string} uid - User ID to filter through Likes
 * @returns - An array of Like Records that will contain the user as well as the Tuit
 */
 async function findAllTuitsLikedByUser(uid){
    const response = await api.get(`${USERS_API}/${uid}/likes`);
    return response.data
}

/**
 * When called this function will attempt to find all the Tuits a user has disliked
 * @param {string} uid - User ID to filter through Dislikes
 * @returns - An array of Dislike Records that will contain the user as well as the Tuit
 */
 async function findAllTuitsDislikedByUser(uid){
    const response = await api.get(`${USERS_API}/${uid}/dislikes`);
    return response.data
}

/**
 * Function used to help create a Like relationship between a Tuit and a user
 * @param {string} uid - The ID of the person who liked the Tuit
 * @param {string} tid - The ID of the Tuit that was liked
 * @returns - The newly created Like Object
 */
async function userLikesTuit(uid, tid){
    const response = await axios.post(`${USERS_API}/${uid}/likes/${tid}`)
    return response.data
}

/**
 * Function used to help destroy a Like relationship between a Tuit and a user
 * @param {string} uid - The ID of the person who liked the Tuit
 * @param {string} tid - The ID of the Tuit that was liked
 * @returns - A status update pertaining to the deletion
 */
async function userUnlikesTuit(uid, tid){
    const response = await axios.delete(`${USERS_API}/${uid}/likes/${tid}`)
    return response.data
}

/**
 * Function used to help create a Dislike relationship between a Tuit and a user
 * @param {string} uid - The ID of the person who disliked the Tuit
 * @param {string} tid - The ID of the Tuit that was disliked
 * @returns - The newly created Dislike Object
 */
async function userDislikesTuit(uid, tid){
    const response = await axios.post(`${USERS_API}/${uid}/dislikes/${tid}`)
    return response.data
}

/**
 * Function used to help destroy a Dislike relationship between a Tuit and a user
 * @param {string} uid - The ID of the person who disliked the Tuit
 * @param {string} tid - The ID of the Tuit that was disliked
 * @returns - A status update pertaining to the deletion
 */
async function userUndislikesTuit(uid, tid){
    const response = await axios.delete(`${USERS_API}/${uid}/dislikes/${tid}`)
    return response.data
}

export {findAllTuitsLikedByUser, findAllTuitsDislikedByUser, userTogglesLikeEvent, userTogglesDislikeEvent, userLikesTuit, userUnlikesTuit, userDislikesTuit, userUndislikesTuit}