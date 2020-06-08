import axios from 'axios';
import {API_URL, MATCHES_API} from "../config";

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

function findCompetMatchDay(compet){
    return axios
        .get(API_URL + "/getMatchCompetition/"+compet)
        .then(response => response.data);
}

function getRonvauTeamMatch(idRTeam){
    return axios
        .get(API_URL + "/getRonvauTeamMatch/"+idRTeam)
        .then(response => response.data);
}

function create(matche){
    return axios.post(MATCHES_API, matche);
}

function update(id, matche){
    return axios.put(MATCHES_API + "/" + id, matche);
}

function deleteMatche(id){
    return axios.delete(MATCHES_API + "/" + id);
}

function postCallMatch(data){
    return axios.post(API_URL + "/postCallMatch", data);
}

function postEncodeMatch(data){
    return axios.post(API_URL + "/postEncodeMatch", data);
}

function editDateMatch(data){
    return axios.post(API_URL + "/editDateMatch", data);
}

function voteMOTM (vote) {
    return axios.post(API_URL + "/voteMOTM", vote)
}

function getMatchDetails (id){
    return axios.get(API_URL + "/getMatchDetails/" + id )
        .then(response => response.data);
}

function getUnOfMatchDetails (id){
    return axios.get(API_URL + "/getUnOfMatchDetails/" + id )
        .then(response => response.data);
}

function getUnOfMatchCompet(idTeamR){
    return axios.get(API_URL + "/getUnOfMatchCompet/" + idTeamR )
        .then(response => response.data);
}

function scoreMatch(data) {
    return axios.post(API_URL+ "/scoreMatch", data);
}

function newMatch(data){
    return axios.post(API_URL+ "/newMatch", data);
}

function newDateMatch(data) {
    return axios.post(API_URL+ "/newDateMatch", data);
}

function editDateUnOffMatch(data){
    return axios.post(API_URL+ "/editDateUnOffMatch", data);
}

function editScore(data){
    return axios.post(API_URL+ "/editScore", data);
}

function calledPlayerMatch(id) {
    return axios.get(API_URL + "/calledPlayerMatch/" + id )
        .then(response => response.data);
}

export default {
    findAll, find, findMatchDay, create, update, findCompetMatchDay, getRonvauTeamMatch, deleteMatche, postCallMatch, postEncodeMatch,
    editDateMatch, voteMOTM, getMatchDetails, getUnOfMatchCompet, getUnOfMatchDetails, scoreMatch, newMatch, newDateMatch, editDateUnOffMatch, editScore, calledPlayerMatch
}