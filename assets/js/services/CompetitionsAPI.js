import axios from 'axios';
import {COMPETITIONS_API} from "../config";

function findAll() {
    return axios
        .get(COMPETITIONS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(COMPETITIONS_API + "/" + id)
        .then(response => response.data);
}

function findTeam(id){
    return axios
        .get(COMPETITIONS_API + "/" + id+"/teams?order[nbrPoints]=desc")
        .then(response => response.data["hydra:member"]);
}

function create(competition){
    return axios.post(COMPETITIONS_API, competition);
}

function update(id, competition){
    return axios.put(COMPETITIONS_API + "/" + id, competition);
}

function deleteCompet(id){
    return axios.delete(COMPETITIONS_API + "/" + id);
}

export default {
    findAll, find, findTeam, create, update, deleteCompet
}