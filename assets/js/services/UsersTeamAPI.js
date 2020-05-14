import axios from 'axios';
import {USER_TEAM_API} from "../config";

function findAll() {
    return axios
        .get(USER_TEAM_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(USER_TEAM_API + "/" + id)
        .then(response => response.data);
}

function create(userTeam){
    return axios.post(USER_TEAM_API, userTeam);
}

function update(id, userTeam){
    return axios.put(USER_TEAM_API + "/" + id, userTeam);
}

function deleteUserTeam(id){
    return axios.delete(USER_TEAM_API + "/" + id);
}

export default {
    findAll, find, create, update, deleteUserTeam
}