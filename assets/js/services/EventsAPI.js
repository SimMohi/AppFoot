import axios from 'axios';
import {API_URL, EVENTS_API} from "../config";

function findAll() {
    return axios
        .get(EVENTS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(EVENTS_API + "/" + id)
        .then(response => response.data);
}

function create(club){
    return axios.post(EVENTS_API, club);
}

function update(id, club){
    return axios.put(EVENTS_API + "/" + id, club);
}

function deleteEvent(id){
    return axios.delete(EVENTS_API + "/" + id);
}

function addTeams(teams){
    return axios.post(API_URL + "/postEventTeams", teams);
}

function getEventsTeam(eventId){
    return axios
        .get(EVENTS_API + "/" + eventId +"/events_teams")
        .then(response => response.data);
}

export default {
    findAll, find, create, update, deleteEvent, addTeams, getEventsTeam
}