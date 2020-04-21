import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import Moment from "react-moment";

const RonvauTeamCalendar = props => {

    const {id} = props.match.params;
    const [matchTeamRonvau, setMatchTeamRonvau] = useState([]);

    const fetchMatch = async () => {
        const response = await MatcheAPI.getRonvauTeamMatch(id);
        response.sort(orderByMatchDay);
        setMatchTeamRonvau(response);
    }

    console.log(matchTeamRonvau);
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
                        <th className={"col-4"}>Domicile</th>
                        <th className={"col-4"}>Extérieur</th>
                        <th className={"col-2"}>Score</th>
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
                        <td className={"col-4"}>{mtr.homeTeam.club.name}</td>
                        <td className={"col-4"}>{mtr.visitorTeam.club.name}</td>
                        <td className={"col-2"}>{mtr.isOver && mtr.homeTeamGoal+"-"+mtr.visitorTeamGoal}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}

export default RonvauTeamCalendar;