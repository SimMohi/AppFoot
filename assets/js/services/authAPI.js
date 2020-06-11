import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {API_URL} from "../config";

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials){
    return axios
        .post(API_URL+ "/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token)
        });
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration > new Date().getTime() / 10000000) {
            setAxiosToken(token);
        }
    }
}

function getUserInfo(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        const {username: user} = jwtDecode(token);
        return axios
            .get(API_URL + "/api/users?email="+user)
            .then(response => response.data["hydra:member"]);
    }
}

function getIsAdmin(){
    return false;
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        const {roles} = jwtDecode(token);
        if (roles.includes("ROLE_ADMIN")){
            return true
        } else {
            return false
        }
    }
    return false
}

function getId(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        const {id} = jwtDecode(token);
        return id;
    }
    return false
}

function isAuthenticated(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration > new Date().getTime() / 10000000) {
            return true;
        }
        return false;
    }
    return false
}

export default {
    authenticate, getUserInfo, logout, setup, isAuthenticated, setAxiosToken, getIsAdmin, getId
};