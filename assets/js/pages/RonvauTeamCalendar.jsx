import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import axios from "axios";


import "react-datepicker/dist/react-datepicker.css";

const RonvauTeamCalendar = props => {

    const {id} = props.match.params;

    const [date, setDate] = useState(new Date());

    const changeDate = async (newDate) => {
        setDate(newDate);
        console.log(newDate.getMonth());
        console.log(newDate.getDate());
        console.log(newDate.getFullYear());

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
        await axios.post("http://localhost:8000/postTrainingDay/", post);
        //await axios.get("http://localhost:8000/getCalendarInfo/"+ get.teamId+"/"+get.date);
    }

    return (
        <>
            <DatePicker
                onChange={date => changeDate(date)}
                selected={date}
            />
        </>
        )
}

export default RonvauTeamCalendar;