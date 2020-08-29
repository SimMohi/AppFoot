import axios from 'axios';
import {API_URL, CARS_API, PASSENGERS_API} from "../config";

function findAll() {
    return axios
        .get(CARS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(CARS_API + "/" + id)
        .then(response => response.data);
}

function create(car){
    return axios.post(API_URL + "/createCar", car);
}

// function addPassenger(carPass){
//     return axios.post(PASSENGERS_API, carPass);
// }

function addPassenger(carPass){
    return axios.post(API_URL+ "/addPassenger", carPass);
}

function delPassenger(id) {
    return axios.delete( PASSENGERS_API + "/" + id);

}

function update(id, car){
    return axios.put(CARS_API + "/" + id, car);
}

function updateCarPass(id, carPass){
    return axios.put(PASSENGERS_API + "/" + id, carPass);
}

function patch(id, car){
    return axios.patch(CARS_API + "/" + id, car);
}

function deleteCar(id){
    return axios.delete(CARS_API + "/" + id);
}

function unSub(post){
    return axios.post(API_URL + "/unSub", post)
}

export default {
    findAll, find, create, addPassenger, update, updateCarPass, patch, deleteCar, delPassenger, unSub
}