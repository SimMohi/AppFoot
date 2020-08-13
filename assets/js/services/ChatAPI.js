import axios from 'axios';
import {API_URL} from "../config";

function getChatInfo (idUser){
    return axios.get(API_URL + "/getChatInfo/"+ idUser)
        .then(response => response["data"]);
}

function sendMessage(data){
    return axios.post(API_URL + "/postMessage", data);
}

function getChatCovoit (id){
    return axios.get(API_URL + "/getChatCovoit/"+ id)
        .then(response => response["data"]);
}

function sendMessageCovoit(data){
    return axios.post(API_URL + "/sendMessageCovoit", data);
}

export default {
    getChatInfo, sendMessage, getChatCovoit, sendMessageCovoit
}