import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import DateFunctions from "../services/DateFunctions";
import {Link} from "react-router-dom";


const MatchPages = props => {

    const {id} = props.match.params;

    const [matchs, setMatchs] = useState();
    const [matchDay, setMatchDay] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [name, setName] = useState('');

    const findMatchs = async () => {
        try {
            const response = await CompetitionsAPI.getMatchCompet(id);
            setName(response["name"]);
            setMatchDay(Object.keys(response["team"]));
            setMatchs(response["team"]);
        } catch (e) {
            console.log(e);
        }
    }

    const selectMatchDay = ({ currentTarget }) => {
        setSelectedDay(currentTarget.value);
    }


    useEffect( () => {
        findMatchs();
    }, []);

    return(
        <>
            <Link to={"/competition"} className={"btn btn-danger mr-3"}><i className="fas fa-arrow-left"/></Link>
            <h3 className={"text-center mb-5"}>Calendrier {name}</h3>
            <div className="w-50 m-auto">
                <select className="form-control w-50" id="matchDay" name={"matchDay"} onChange={selectMatchDay}>
                    {matchDay.map((opt,index) =>
                    <option key={index} value={opt}>journée numéro {opt}</option>
                    )}
                </select>
                <div className={"mt-3 whiteBorder p-5"}>
                    {typeof matchs != "undefined" && typeof selectedDay != 'undefined' && matchs[selectedDay].map((mat,index) =>
                        <div key={mat.id}>
                            <div className={"row m-2"}>
                                <div className="col-2">
                                    {mat.date != null && DateFunctions.dateFormatFrDMHM(mat.date) || "Non défini"}
                                </div>
                                <div className="col-4">
                                    {mat.homeTeam.club.name}
                                </div>
                                <div className="col-4">
                                    {mat.visitorTeam.club.name}
                                </div>
                                <div className="col-2">
                                    {
                                        (mat.homeTeamGoal != null && mat.homeTeamGoal.toString() || "")
                                        + " - " +
                                        (mat.visitorTeamGoal != null && mat.visitorTeamGoal.toString() || "")
                                    }
                                </div>
                            </div>
                        <hr/>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default MatchPages;