/*
* Cesar Guerrero
* 11/19/22
* CS5500 - Fall 2022
* 
* Assignment 4
*/

import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE;

const AUTH_API = `${BASE_URL}/api/auth`;

const api = axios.create({
    withCredentials: true,
})

export const signup = async (user) => {
    const response = await api.post(`${AUTH_API}/signup`, user);
    return response.data;
}

export const profile = async () => {
    const response = await api.post(`${AUTH_API}/profile`);
    return response.data;
}

export const logout = (user) => {
    return api.post(`${AUTH_API}/logout`, user).then(response => response.data);
}

export const login = async (credentials) => {
    const response = await api.post(`${AUTH_API}/login`, credentials);
    return response.data
}


