import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE;
const TUITS_API = `${BASE_URL}/tuits`;
const USERS_API = `${BASE_URL}/users`;

const api = axios.create({
  withCredentials: true,
  headers:{
    "Access-Control-Allow-Origin": "*"
  }
  
})

export const findAllTuits = () =>
  axios.get(TUITS_API).then(response => response.data);

export const findTuitsByUser = (uid) =>
  api.get(`${USERS_API}/${uid}/tuits`).then(response => response.data);

export const findTuitById = (tid) =>
  axios.get(`${TUITS_API}/${tid}`).then(response => response.data);

export const createTuitByUser = (uid, tuit) =>
  api.post(`${USERS_API}/${uid}/tuits`, tuit).then(response => response.data);

export const updateTuit = (tid, tuit) =>
  axios.post(`${TUITS_API}/${tid}`, tuit).then(response => response.data);

export const deleteTuit = (tid) =>
  axios.delete(`${TUITS_API}/${tid}`).then(response => response.data);
