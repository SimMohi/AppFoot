import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/user_teams/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/user_teams/" + id)
        .then(response => response.data);
}

function create(userTeam){
    return axios.post("http://localhost:8000/api/user_teams", userTeam);
}

function update(id, userTeam){
    return axios.put("http://localhost:8000/api/user_teams/" + id, userTeam);
}

function deleteUserTeam(id){
    return axios.delete("http://localhost:8000/api/user_teams/" + id);
}

export default {
    findAll, find, create, update, deleteUserTeam
}