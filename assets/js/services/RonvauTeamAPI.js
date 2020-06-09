import axios from 'axios';
import {API_URL, TEAM_RONVAUS_API} from "../config";

function findAll() {
    return axios
        .get(TEAM_RONVAUS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(TEAM_RONVAUS_API + "/" + id)
        .then(response => response.data);
}

function findCompetRonvau(){
    return axios
        .get(API_URL + "/getCompetitionsRonvau/1")
        .then(response => response.data);
}

function create(teamRonvau){
    return axios.post(TEAM_RONVAUS_API, teamRonvau);
}

function update(id, teamRonvau){
    return axios.put(TEAM_RONVAUS_API + "/" + id, teamRonvau);
}

function deleteTeamRonvau(id){
    return axios.delete(TEAM_RONVAUS_API +"/" + id);
}

function getCalendarInfo(teamId){
    return axios.get(API_URL +"/getCalendarInfo/"+ teamId +"/"+"no")
        .then(response => response.data);
}

function getPersonnalCalendarInfo(userId){
    return axios.get(API_URL +"/getPersonnalCalendarInfo/"+ userId)
        .then(response => response.data);
}

function getTeamMember(id){
    return axios.get(API_URL +"/getTeamMember/"+ id)
        .then(response => response.data);
}

export default {
    findAll, find, create, update, findCompetRonvau, deleteTeamRonvau, getCalendarInfo, getPersonnalCalendarInfo, getTeamMember
}