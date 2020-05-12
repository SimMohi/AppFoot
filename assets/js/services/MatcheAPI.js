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

function findCompetMatchDay(compet, matchDay){
    return axios
        .get("http://localhost:8000/getMatchCompetition/"+compet+"/"+matchDay)
        .then(response => response.data);
}

function getRonvauTeamMatch(idRTeam){
    return axios
        .get("http://localhost:8000/getRonvauTeamMatch/"+idRTeam)
        .then(response => response.data);
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

function postCallMatch(data){
    return axios.post("http://localhost:8000/postCallMatch", data);
}

function postEncodeMatch(data){
    return axios.post("http://localhost:8000/postEncodeMatch", data);
}

function editDateMatch(data){
    return axios.post("http://localhost:8000/editDateMatch", data);
}

function voteMOTM (vote) {
    return axios.post("http://localhost:8000/voteMOTM", vote)
}

export default {
    findAll, find, findMatchDay, create, update, findCompetMatchDay, getRonvauTeamMatch, deleteMatche, postCallMatch, postEncodeMatch, editDateMatch, voteMOTM
}