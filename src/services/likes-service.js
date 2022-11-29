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

export const userTogglesLikeEvent = async (uid, tid, eventType) => {
    const response = await api.put(`${USERS_API}/${uid}/likes/${tid}?eventType=${eventType}`);
    return response.data
}
