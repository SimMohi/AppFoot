import React, {useEffect, useState} from 'react';
import EventsAPI from "../services/EventsAPI";
import {Link} from "react-router-dom";

const EventSubPage = props => {
    const {id} = props.match.params;
    const [total, setTotal] = useState(0);
    const [teams, setTeams] = useState([]);


    const fetchEvent = async () => {
        const response  = await EventsAPI.getEventUserTeam(id);
        let totalR = 0;
        for (let i = 0; i < response.length; i++){
            totalR += response[i]["sub"].length;
        }
        setTotal(totalR);
        setTeams(response);
    }

    useEffect(() => {
        fetchEvent()
    }, [id]);

    return (
        <>
            <h3 className={"mb-3"}>Liste des différents inscrits à cette compétition</h3>
            <p>{total} personnes sont inscrites à cet événement</p>
            {teams.map((t, index) =>
                <div key={index} className={"border rounded m-3 p-3"}>
                    <h6><u>{t.name}</u></h6>
                    <div className={'d-flex flex-row'}>
                        {t.sub.map((s, index) =>
                            <Link to={"/profil/"+s.id} key={s.id}className={"btn btn-link m-2"}>{s.name}</Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default EventSubPage;