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
 * @param uid - The ID of the person who liked the Tuit
 * @param tid - the ID of the Tuit that was liked
 * @returns This will return a response status of 200 (SUCCESS), 403 (FORBIDDEN), 404 (NOT FOUND)
 */
export const userTogglesLikeEvent = async (uid, tid) => {
    const response = await api.put(`${USERS_API}/${uid}/likes/${tid}`);
    return response.data
}

/**
 * When a user dislikes a Tuit, we need to make a call to the server to update the database accordingly
 * @param {string} uid - The ID of the person who disliked the Tuit
 * @param {string} tid - The ID of the Tuit that was disliked
 * @returns {Response Status} This will return a response status of 200 (SUCCESS), 403 (FORBIDDEN), 404 (NOT FOUND)
 */
export const userTogglesDislikeEvent = async (uid, tid) => {
    const response = await api.put(`${USERS_API}/${uid}/dislikes/${tid}`);
    return response.data
}

/**
 * When called this function will attempt to find all the Tuits a user has liked
 * @param {string} uid - User ID to filter through Likes
 * @returns - An array of Like Records that will contain the user as well as the Tuit
 */
export const findAllTuitsLikedByUser = async (uid) => {
    const response = await api.get(`${USERS_API}/${uid}/likes`);
    return response.data
}

/**
 * When called this function will attempt to find all the Tuits a user has disliked
 * @param {string} uid - User ID to filter through Dislikes
 * @returns - An array of Dislike Records that will contain the user as well as the Tuit
 */
export const findAllTuitsDislikedByUser = async (uid) => {
    const response = await api.get(`${USERS_API}/${uid}/dislikes`);
    return response.data
}