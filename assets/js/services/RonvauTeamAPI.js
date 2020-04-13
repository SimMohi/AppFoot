import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/team_ronvaus/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/team_ronvaus/" + id)
        .then(response => response.data);
}

function create(teamRonvau){
    return axios.post("http://localhost:8000/api/team_ronvaus", teamRonvau);
}

function update(id, teamRonvau){
    return axios.put("http://localhost:8000/api/team_ronvaus/" + id, teamRonvau);
}

function deleteTeamRonvau(id){
    return axios.delete("http://localhost:8000/api/team_ronvaus/" + id);
}

export default {
    findAll, find, create, update, deleteTeamRonvau
}