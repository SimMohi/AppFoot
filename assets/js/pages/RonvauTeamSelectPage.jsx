import React from 'react';
import {Link} from "react-router-dom";

const RonvauTeamSelectPage = props => {
    const {id} = props.match.params;

    return(
        <>
            <Link to={"/equipeRonvau/"+id+"/calendar"} className={"btn btn-sm btn-warning mr-3"}>Calendrier</Link>
            <Link to={"/equipeRonvau/"+id+"/matchCalendar"} className={"btn btn-sm btn-warning mr-3"}>Calendrier des matchs</Link>
        </>
    )
}

export default RonvauTeamSelectPage;