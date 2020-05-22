import axios from 'axios';
import {API_URL, CLUBS_API} from "../config";

function findAll() {
    return axios
        .get(CLUBS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(CLUBS_API + "/" + id)
        .then(response => response.data);
}

function create(club){
    return axios.post(CLUBS_API, club);
}

function update(id, club){
    return axios.put(CLUBS_API + "/" + id, club);
}

function deleteClub(id){
    return axios.delete(CLUBS_API + "/" + id);
}

function postClubAddress(address) {
    return axios.post(API_URL +"/postClubAddress", address)
}

export default {
    findAll, find, create, update, deleteClub, postClubAddress
}