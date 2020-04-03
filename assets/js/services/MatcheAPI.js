import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/matches/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/matches/" + id)
        .then(response => response.data);
}

function findMatchDay(matchDay){
    return axios
        .get("http://localhost:8000/api/matches?matchDay="+matchDay)
        .then(response => response.data["hydra:member"]);
}

function create(matche){
    return axios.post("http://localhost:8000/api/matches", matche);
}

function update(id, matche){
    return axios.put("http://localhost:8000/api/matches/" + id, matche);
}

function deleteMatche(id){
    return axios.delete("http://localhost:8000/api/matches/" + id);
}

export default {
    findAll, find, findMatchDay, create, update, deleteMatche
}