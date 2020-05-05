import axios from "axios";

function findAllTrainingDay(teamRonvau) {
    return axios
        .get("http://localhost:8000/api/training_days?teamRonvau=/api/team_ronvaus/"+teamRonvau)
        .then(response => response.data["hydra:member"]);
}
//
// function createTrainingDay(teamRonvau){
//     return axios.post("http://localhost:8000/api/training_days", teamRonvau);
// }

function createTrainingDay(teamRonvau){
    return axios.post("http://localhost:8000/postTrainingDay", teamRonvau);
}



function deleteTrainingDay(obj){
    return axios.post("http://localhost:8000/deleteTrainingDay", obj);
}

function postAbsence(obj){
    return axios.post("http://localhost:8000/postAbsence", obj);
}

function remAbsence(obj) {
    return axios.post("http://localhost:8000/remAbsence", obj);
}

function getPlayerTrainings(idTraining){
    return axios
        .get("http://localhost:8000/getTrainingPlayer/"+idTraining)
        .then(response => response.data);
}

function postPresence(post){
    return axios.post("http://localhost:8000/postPresence", post);
}

function editTraining(post){
    return axios.post("http://localhost:8000/editTraining", post);
}



export default {
    findAllTrainingDay, createTrainingDay, deleteTrainingDay, postAbsence, remAbsence, getPlayerTrainings, postPresence, editTraining
}