import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/clubs/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/clubs/" + id)
        .then(response => response.data);
}

function create(club){
    return axios.post("http://localhost:8000/api/clubs", club);
}

function update(id, club){
    return axios.put("http://localhost:8000/api/clubs/" + id, club);
}

function deleteClub(id){
    return axios.delete("http://localhost:8000/api/clubs/" + id);
}

export default {
    findAll, find, create, update, deleteClub
}