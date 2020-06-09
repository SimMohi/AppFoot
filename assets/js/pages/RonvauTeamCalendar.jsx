import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import axios from "axios";


import "react-datepicker/dist/react-datepicker.css";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {API_URL} from "../config";

const RonvauTeamCalendar = props => {

    const {id} = props.match.params;

    const [training, setTraining] = useState([]);
    const [date, setDate] = useState(new Date());

    const findCalendarInfos = async () => {
        const response = await RonvauTeamAPI.getCalendarInfo(id);
        let trainingArr = [];
        for (let i = 0; i < response.length; i++){
            if (response[i]["type"] == "Entrainement"){
                trainingArr.push(response[i]);
            }
        }
        setTraining(trainingArr);
    }

    const changeDate = async (newDate) => {
        setDate(newDate);

        let post = {
            day: "Jeudi",
            teamId: id,
            start: "19:00",
            end: "20:00"
        }
        let get = {
            date: newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate(),
            teamId: id,
        }
        //await axios.post("http://localhost:8000/postTrainingDay/", post);
        await axios.get(API_URL + "/getCalendarInfo/"+ get.teamId+"/"+get.date);
    }


    useEffect( () => {
        findCalendarInfos();
    }, []);

    return (
        <>
            {training.map((train, index) =>
                <div key={index}>
                    {train.date}
                </div>

            )}
        </>
        )
}

export default RonvauTeamCalendar;