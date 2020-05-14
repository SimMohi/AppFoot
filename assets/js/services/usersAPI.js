import axios from 'axios';
import Cache from "./cache";
import {API_URL, USERS_API} from '../config'

async function findAll() {

    const cachedUsers = await Cache.get("users");

    if (cachedUsers) return cachedUsers;

    return axios
        .get(USERS_API)
        .then(response => {
            const users = response.data["hydra:member"];
            Cache.set("users", users);
            return users;
        });
}

function findUnaccepted(){
    return axios
        .get(USERS_API+"?isAccepted=false")
        .then(response => response.data["hydra:member"]);
}

function create (user){
    return axios
        .post(USERS_API, user);
}


function update(id, user){
    return axios.put(USERS_API + "/" + id, user);
}

function deleteUser(id){
    return axios.delete(USERS_API + "/" + id)
        .then(async response => {
            const cachedUsers = await Cache.get("users");
            if (cachedUsers){
                Cache.set("users", cachedUsers.filter(c => c.id !== id));
            }
        });
    //Cache.invalidate("users");
}

function profile(id) {
    return axios.get(API_URL + "/profile/" + id);
}

function getNotifications(id){
    return axios.get(API_URL + "/getNotificationsUser/" + id)
        .then(response => response.data);
}

export default {
    findAll, create, findUnaccepted, update, profile, deleteUser, getNotifications
}