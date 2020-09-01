import axios from "axios";
import {API_URL} from "../config";


function addPhotos(post){
    return axios.post(API_URL + "/addPhotos", post)
}

function removePhoto(id){
    return axios.get(API_URL + "/removePhoto/"+ id);
}

function removeFolder(id){
    return axios.get(API_URL + "/removeFolder/"+ id);
}

function getAllPhotos() {
    return axios.get(API_URL + "/getAllPhotos");
}

function getFolderPhotos(id) {
    return axios.get(API_URL + "/getFolderPhotos/"+ id);

}

function createFolder(post){
    return axios.post(API_URL + "/createFolder", post);
}

function getAllowPhotos(){
    return axios.get(API_URL + "/getAllowPhotos");
}

function getAllowPhotosT(id){
    return axios.get(API_URL + "/getAllowPhotosT/"+id);
}


export default {
    addPhotos, removePhoto, getAllPhotos, getFolderPhotos, createFolder, getAllowPhotos, getAllowPhotosT, removeFolder
}