import axios from "axios";
import {PLAYER_MATCHES_API} from "../config";

function findAll(){
    return axios
        .get(PLAYER_MATCHES_API)
        .then(response => response.data["hydra:member"]);
}

function findMatch(matchId){
    return axios
        .get(PLAYER_MATCHES_API + "?idMatch=/api/matches/" + matchId)
        .then(response => response.data["hydra:member"]);
}

function deletePlayerMatch(id){
    return axios.delete(PLAYER_MATCHES_API + "/"+ id);
}


function update(id, playerMatch){
    return axios.put(PLAYER_MATCHES_API+ "/" + id, playerMatch);
}


export default {
    findAll, findMatch ,deletePlayerMatch, update
}