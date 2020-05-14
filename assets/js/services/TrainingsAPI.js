import axios from "axios";
import {API_URL} from "../config";

function findAllTrainingDay(teamRonvau) {
    return axios
        .get("http://localhost:8000/api/training_days?teamRonvau=/api/team_ronvaus/"+teamRonvau)
        .then(response => response.data["hydra:member"]);
}

function createTrainingDay(teamRonvau){
    return axios.post(API_URL +"/postTrainingDay", teamRonvau);
}


function deleteTrainingDay(obj){
    return axios.post(API_URL +"/deleteTrainingDay", obj);
}

function postAbsence(obj){
    return axios.post(API_URL +"/postAbsence", obj);
}

function remAbsence(obj) {
    return axios.post(API_URL +"/remAbsence", obj);
}

function getPlayerTrainings(idTraining){
    return axios
        .get(API_URL +"/getTrainingPlayer/"+idTraining)
        .then(response => response.data);
}

function postPresence(post){
    return axios.post(API_URL + "/postPresence", post);
}

function editTraining(post){
    return axios.post(API_URL +"/editTraining", post);
}



export default {
    findAllTrainingDay, createTrainingDay, deleteTrainingDay, postAbsence, remAbsence, getPlayerTrainings, postPresence, editTraining
}