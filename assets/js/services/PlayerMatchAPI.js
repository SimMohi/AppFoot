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


function update(id, playerMatch){
    return axios.put("http://localhost:8000/api/player_matches/" + id, playerMatch);
}


export default {
    findAll, findMatch ,deletePlayerMatch, update
}