import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/users")
        .then(response => response.data["hydra:member"]);
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
    return axios.delete("http://localhost:8000/api/users/" + id);
}

function profile(id) {
    return axios.get("http://localhost:8000/profile/" + id);
}

export default {
    findAll, create, findUnaccepted, update, profile, deleteUser
}