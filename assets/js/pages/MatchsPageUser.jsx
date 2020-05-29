import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import DateFunctions from "../services/DateFunctions";


const MatchPages = props => {

    const {id} = props.match.params;

    const [matchs, setMatchs] = useState();
    const [matchDay, setMatchDay] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);

    const findMatchs = async () => {
        try {
            const response = await CompetitionsAPI.getMatchCompet(id);
            setMatchDay(Object.keys(response));
            setMatchs(response);
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
            <div className="w-50">
                <select className="form-control w-50" id="matchDay" name={"matchDay"} onChange={selectMatchDay}>
                    {matchDay.map(opt =>
                    <option key={opt} value={opt}>journée numéro {opt}</option>
                    )}
                </select>
                <div className={"mt-3 bgGrey"}>
                    {typeof matchs != "undefined" && typeof selectedDay != 'undefined' && matchs[selectedDay].map(mat =>
                        <>
                            <div key={mat.id} className={"row m-2"}>
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
                                        (mat.homeTeamGoal != null && mat.visitorTeamGoal.toString() || "")
                                    }
                                </div>
                            </div>
                        <hr/>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
export default MatchPages;