import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";

const RonvauTeamCalendar = props => {

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
                        <th className={"col-2"}>Journée</th>
                        <th className={"col-4"}></th>
                        <th className={"col-4"}></th>
                        <th className={"col-2"}></th>
                    </tr>
                </thead>
                <tbody>
                {matchTeamRonvau.map(mtr =>
                    <tr key={mtr.id} className={"row"}>
                        <td className={"col-2"}>{mtr.matchDay}</td>
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