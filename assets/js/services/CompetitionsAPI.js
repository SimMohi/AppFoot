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
    findAll, find, create, update, deleteCompet
}