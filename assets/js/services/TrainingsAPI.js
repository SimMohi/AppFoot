import axios from "axios";

function findAllTrainingDay(teamRonvau) {
    return axios
        .get("http://localhost:8000/api/training_days?teamRonvau=/api/team_ronvaus/"+teamRonvau)
        .then(response => response.data["hydra:member"]);
}

function createTrainingDay(teamRonvau){
    return axios.post("http://localhost:8000/api/training_days", teamRonvau);
}

function deleteTrainingDay(id){
    return axios.delete("http://localhost:8000/api/training_days/" + id);
}

export default {
    findAllTrainingDay, createTrainingDay, deleteTrainingDay
}