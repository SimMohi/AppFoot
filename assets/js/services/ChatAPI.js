import axios from 'axios';
import {API_URL} from "../config";

function getChatInfo (idUser){
    return axios.get(API_URL + "/getChatInfo/"+ idUser)
        .then(response => response["data"]);
}

function sendMessage(data){
    return axios.post(API_URL + "/postMessage", data);
}

export default {
    getChatInfo, sendMessage
}