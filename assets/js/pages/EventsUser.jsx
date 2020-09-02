import React, {useEffect, useState} from 'react';
import EventsAPI from "../services/EventsAPI";
import authAPI from "../services/authAPI";
import DateFunctions from "../services/DateFunctions";
import {toast} from "react-toastify";

const EventsUser = props => {
    const idUser = authAPI.getId();
    const [events, setEvents] = useState([]);
    const [reload, setReload] = useState(0);

    const FindEvents = async () => {
        try {
            const data = await EventsAPI.getEventUser(idUser);
            setEvents(data);
        } catch (error) {
            console.log(error.response);
        }
    }



    useEffect( () => {
        FindEvents();
    }, [reload]);

    const subscribe = async (eventTeam) => {
        const data = {
            user: idUser,
            eventTeam: eventTeam
        }
        try{
            await EventsAPI.createUTE(data);
        }catch (e) {
            toast.error("Erreur lors de l'iscription");
        }
        setReload(reload+1);
    }

    const unSubscribe = async (eventTeam) => {
        const data = {
            user: idUser,
            eventTeam: eventTeam
        }
        try{
            await EventsAPI.unSubUTE(data);
        }catch (e) {
            toast.error("Erreur lors de la désinscription");
        }
        setReload(reload+1);
    }


    return (
        <>
            <h3 className={"mb-3"}>Evenements de mes équipes</h3>
            {events.map((team, index) =>
                <div key={index} className={""}>
                    <h5 className={"m-5"}>{team.name}</h5>
                    <table className="table table-hover text-center whiteBorder">
                        <thead className={"bgGrey"}>
                        <tr className={"row ml-3 mr-3"}>
                            <td className={"col-3"}>Nom</td>
                            <td className={"col-5"}>Description</td>
                            <td className={"col-2"}>Date</td>
                            <td className={"col-2"}></td>
                        </tr>
                        </thead>
                        {team.events.map((eve, index2) =>
                            <tbody key={index2}>
                                <tr className="row ml-3 mr-3">
                                    <td className={"col-3"}>{eve.name}</td>
                                    <td className={"col-5"}>{eve.description}</td>
                                    <td className={"col-2"}>{DateFunctions.dateFormatFrDMHM(eve.date)}</td>
                                    <td className={"col-2"}>{eve["subsc"] &&
                                        <button onClick={() => unSubscribe(eve.id)} className={"btn btn-danger"}>Se désinscrire</button>
                                        ||
                                        <button onClick={() => subscribe(eve.id)} className={"btn btn-warning"}>S'inscire</button>
                                    }</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            )}
        </>
    )

}


export default EventsUser;