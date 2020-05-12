import axios from 'axios';
import Cache from "./cache";

async function findAll() {

    const cachedUsers = await Cache.get("users");

    if (cachedUsers) return cachedUsers;

    return axios
        .get("http://localhost:8000/api/users")
        .then(response => {
            const users = response.data["hydra:member"];
            Cache.set("users", users);
            return users;
        });
}

function findUnaccepted(){
    return axios
        .get("http://localhost:8000/api/users?isAccepted=false")
        .then(response => response.data["hydra:member"]);
}

function create (user){
    return axios
        .post("http://localhost:8000/api/users", user);
}


function update(id, user){
    return axios.put("http://localhost:8000/api/users/" + id, user);
}

function deleteUser(id){
    return axios.delete("http://localhost:8000/api/users/" + id)
        .then(async response => {
            const cachedUsers = await Cache.get("users")
            if (cachedUsers){
                Cache.set("users", cachedUsers.filter(c => c.id !== id));
            }
        });
    //Cache.invalidate("users");
}

function profile(id) {
    return axios.get("http://localhost:8000/profile/" + id);
}

function getNotifications(id){
    return axios.get("http://localhost:8000/getNotificationsUser/" + id)
        .then(response => response.data);
}

export default {
    findAll, create, findUnaccepted, update, profile, deleteUser, getNotifications
}