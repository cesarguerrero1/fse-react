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

export const userTogglesTuitLikes = async (uid, tid) => {
    const response = await api.put(`${USERS_API}/${uid}/likes/${tid}`);
    return response.data
}
