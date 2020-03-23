import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/competitions/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/competitions/" + id)
        .then(response => response.data);
}

function findTeam(id){
    return axios
        .get("http://localhost:8000/api/competitions/" + id+"/teams?order[nbrPoints]=desc")
        .then(response => response.data["hydra:member"]);
}

function create(competition){
    return axios.post("http://localhost:8000/api/competitions", competition);
}

function update(id, competition){
    return axios.put("http://localhost:8000/api/competitions/" + id, competition);
}

function deleteCompet(id){
    return axios.delete("http://localhost:8000/api/competitions/" + id);
}

export default {
    findAll, find, findTeam, create, update, deleteCompet
}