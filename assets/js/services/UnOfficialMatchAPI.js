import axios from 'axios';
import {API_URL, UNOFFICIAL_MATCH_API} from "../config";

function findAll() {
    return axios
        .get(UNOFFICIAL_MATCH_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(API_URL + "/unOffMatch/" + id)
        .then(response => response.data);
}

function create(unOffMatch){
    return axios.post(UNOFFICIAL_MATCH_API, unOffMatch);
}

function update(id, unOffMatch){
    return axios.put(UNOFFICIAL_MATCH_API + "/" + id, unOffMatch);
}

function deleteUnOffMatch(id){
    return axios.delete(UNOFFICIAL_MATCH_API + "/" + id);
}

function selectUnoff(data) {
    return axios.post(API_URL + "/selectUnoff", data);
}

function editDateUnOffMatch(data){
    return axios.post(API_URL + "/editDateUnOffMatch", data);
}

function delUnOffPl(data){
    return axios.post(API_URL + "/delUnOffPl", data);
}


export default {
    findAll, find, create, update, deleteUnOffMatch, selectUnoff, delUnOffPl, editDateUnOffMatch
}