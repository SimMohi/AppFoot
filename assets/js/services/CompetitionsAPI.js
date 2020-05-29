import axios from 'axios';
import {API_URL, COMPETITIONS_API, NAME_COMPETITIONS_API} from "../config";

function findAllName() {
    return axios
        .get(NAME_COMPETITIONS_API)
        .then(response => response.data["hydra:member"]);
}

function findAll() {
    return axios
        .get(COMPETITIONS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(COMPETITIONS_API + "/" + id)
        .then(response => response.data);
}

function findTeam(id){
    return axios
        .get(COMPETITIONS_API + "/" + id+"/teams?order[nbrPoints]=desc")
        .then(response => response.data["hydra:member"]);
}

function getMatchCompet (id){
    return axios.get(API_URL + "/getMatchCompet/" + id)
        .then(response => response.data);
}

function create(competition){
    return axios.post(COMPETITIONS_API, competition);
}

function update(id, competition){
    return axios.put(COMPETITIONS_API + "/" + id, competition);
}

function deleteCompet(id){
    return axios.delete(COMPETITIONS_API + "/" + id);
}

function getRanking (id){
    return axios.get(API_URL + "/getRankingCompetition/" + id)
        .then(response => response.data);
}

export default {
    findAll, find, findTeam, create, update, deleteCompet, findAllName, getRanking, getMatchCompet
}