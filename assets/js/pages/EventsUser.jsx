import React, {useEffect, useState} from 'react';
import EventsAPI from "../services/EventsAPI";
import authAPI from "../services/authAPI";
import DateFunctions from "../services/DateFunctions";

const EventsUser = props => {
    const idUser = authAPI.getId();
    const [events, setEvents] = useState([]);

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
    }, []);

    console.log(events);

    return (
        <>
            <h3>Evenements de mes équipes</h3>
            {events.map((team, index) =>
                <div key={index}>
                    <h5 className={"m-5"}>{team.name}</h5>
                    {team.events.map((eve, index2) =>
                        <table key={index2} className="table table-hover text-center">
                            {index == 0 && index2 ==0 &&
                                <thead className={"bgGrey"}>
                                    <tr className={"row"}>
                                        <td className={"col-4"}>Nom</td>
                                        <td className={"col-6"}>Description</td>
                                        <td className={"col-2"}>Date</td>
                                    </tr>
                                </thead>
                            }
                            <tbody>
                                <tr className="row">
                                    <td className={"col-4"}>{eve.name}</td>
                                    <td className={"col-6"}>{eve.description}</td>
                                    <td className={"col-2"}>{DateFunctions.dateFormatFrDMHM(eve.date)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </>
    )

}


export default EventsUser;