import axios from "axios";
import {API_URL, NOTIFICATIONS_API} from "../config";

function newTeamNotif(data){
        return axios
            .post(API_URL + "/newTeamNotif", data);
}

function seenNotif(data){
        return axios
            .post(API_URL + "/seenNotif", data);
}

function newNotifCarPass(data) {
        return axios
            .post(API_URL + "/newNotifCarPass", data);
}

export default {newTeamNotif, seenNotif, newNotifCarPass}