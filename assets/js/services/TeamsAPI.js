import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/teams/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/teams/" + id)
        .then(response => response.data);
}

function findCompet(idCompet){
    return axios
        .get("http://localhost:8000/api/teams/?competition="+idCompet)
        .then(response => response.data["hydra:member"]);
}

function create(team){
    return axios.post("http://localhost:8000/api/teams", team);
}

function update(id, team){
    return axios.put("http://localhost:8000/api/teams/" + id, team);
}

function deleteTeam(id){
    return axios.delete("http://localhost:8000/api/teams/" + id);
}

export default {
    findAll, find, findCompet, create, update, deleteTeam
}