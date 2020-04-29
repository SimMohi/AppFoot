import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import Moment from "react-moment";
import {Link} from "react-router-dom";

const RonvauTeamCalendarMatch = props => {

    const {id} = props.match.params;
    const [matchTeamRonvau, setMatchTeamRonvau] = useState([]);

    const fetchMatch = async () => {
        const response = await MatcheAPI.getRonvauTeamMatch(id);
        response.sort(orderByMatchDay);
        setMatchTeamRonvau(response);
    }

    function orderByMatchDay(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.matchDay;
        const bandB = b.matchDay;

        let comparison = 0;
        if (bandA < bandB) {
            comparison = -1;
        } else if (bandA > bandB) {
            comparison = 1;
        }
        return comparison;
    }

    useEffect( () => {
        fetchMatch();
    }, []);

    return(
        <>
            <table className="mt-5 table table-hover text-center container">
                <thead className={""}>
                    <tr className={"row"}>
                        <th className={"col-1"}>Journée</th>
                        <th className={"col-1"}>Date</th>
                        <th className={"col-3"}>Domicile</th>
                        <th className={"col-3"}>Extérieur</th>
                        <th className={"col-2"}>Score</th>
                        <th className={"col-2"}></th>
                    </tr>
                </thead>
                <tbody>
                {matchTeamRonvau.map(mtr =>
                    <tr key={mtr.id} className={"row"}>
                        <td className={"col-1"}>{mtr.matchDay}</td>
                        <td className={"col-1"}>{mtr.homeTeam.day} &nbsp;
                            {mtr.homeTeam.hour != null &&
                            <Moment format="HH:mm">
                                {mtr.homeTeam.hour}
                            </Moment>
                            }
                        </td>
                        <td className={"col-3"}>{mtr.homeTeam.club.name}</td>
                        <td className={"col-3"}>{mtr.visitorTeam.club.name}</td>
                        <td className={"col-2"}>{mtr.isOver && (mtr.homeTeamGoal+"-"+mtr.visitorTeamGoal)
                        ||
                            <Link to={"/match/"+mtr.id+"/select"} className={"btn btn-sm btn-primary mr-3"}>Convocations</Link>
                        }</td>
                        <td className={"col-2"}>
                            <Link to={"/match/"+mtr.id+"/encode"} className={"btn btn-sm btn-secondary"}>Encodage</Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}

export default RonvauTeamCalendarMatch;