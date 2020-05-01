import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/events/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/events/" + id)
        .then(response => response.data);
}

function create(club){
    return axios.post("http://localhost:8000/api/events", club);
}

function update(id, club){
    return axios.put("http://localhost:8000/api/events/" + id, club);
}

function deleteEvent(id){
    return axios.delete("http://localhost:8000/api/events/" + id);
}

function addTeams(teams){
    return axios.post("http://localhost:8000/postEventTeams", teams);
}

function getEventsTeam(eventId){
    return axios
        .get("http://localhost:8000/api/events/" + eventId +"/events_teams")
        .then(response => response.data);
}

export default {
    findAll, find, create, update, deleteEvent, addTeams, getEventsTeam
}