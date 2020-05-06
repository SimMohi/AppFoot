import axios from 'axios';

function getChatInfo (idUser){
    return axios.get("http://localhost:8000/getChatInfo/"+ idUser)
        .then(response => response["data"]);
}

function sendMessage(data){
    return axios.post("http://localhost:8000/postMessage", data);
}

export default {
    getChatInfo, sendMessage
}