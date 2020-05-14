import axios from 'axios';
import {TEAMS_API} from "../config";

function findAll() {
    return axios
        .get(TEAMS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(TEAMS_API + "/" + id)
        .then(response => response.data);
}

function findCompet(idCompet){
    return axios
        .get(TEAMS_API +"/?competition="+idCompet)
        .then(response => response.data["hydra:member"]);
}

function create(team){
    return axios.post(TEAMS_API, team);
}

function update(id, team){
    return axios.put(TEAMS_API +"/" + id, team);
}

function deleteTeam(id){
    return axios.delete(TEAMS_API +"/" + id);
}

export default {
    findAll, find, findCompet, create, update, deleteTeam
}