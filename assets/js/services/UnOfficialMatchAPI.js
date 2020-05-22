import axios from 'axios';
import {UNOFFICIAL_MATCH_API} from "../config";

function findAll() {
    return axios
        .get(UNOFFICIAL_MATCH_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(UNOFFICIAL_MATCH_API + "/" + id)
        .then(response => response.data);
}

function create(unOffMatch){
    return axios.post(UNOFFICIAL_MATCH_API, unOffMatch);
}

function update(id, unOffMatch){
    return axios.put(UNOFFICIAL_MATCH_API + "/" + id, unOffMatch);
}

function deleteUnOffMatch(id){
    return axios.delete(UNOFFICIAL_MATCH_API + "/" + id);
}


export default {
    findAll, find, create, update, deleteUnOffMatch,
}