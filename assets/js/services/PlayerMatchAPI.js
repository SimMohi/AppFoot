import axios from "axios";

function findAll(){
    return axios
        .get("http://localhost:8000/api/player_matches/")
        .then(response => response.data["hydra:member"]);
}

function findMatch(matchId){
    return axios
        .get("http://localhost:8000/api/player_matches?idMatch=/api/matches/" + matchId)
        .then(response => response.data["hydra:member"]);
}

function deletePlayerMatch(id){
    return axios.delete("http://localhost:8000/api/player_matches/"+ id);
}

export default {
    findAll, findMatch ,deletePlayerMatch
}