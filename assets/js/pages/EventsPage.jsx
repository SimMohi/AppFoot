import React, { useState, useEffect } from "react";

import EventsAPI from "../services/EventsAPI";
import EventPage from "./EventPage";
import Header from "../components/Header";
import DateFunctions from "../services/DateFunctions";
import authAPI from "../services/authAPI";

const EventsPage = props => {
    const [events, setEvents] = useState([]);
    const [show, setShow] = useState({
        state: false,
        value: "",
    });


    const FindEvents = async () => {
        try {
            const data = await EventsAPI.findAll();
            setEvents(data);
        } catch (error) {
            console.log(error.response);
        }
    }


    useEffect( () => {
        FindEvents();
    }, []);


    const handleDelete = id => {
        const originalEvents = [...events];
        setEvents(events.filter(event => event.id !== id));
        try {
            EventsAPI.deleteEvent(id);
        } catch (error) {
            console.log(error.response);
            setEvents(originalEvents);
        }
    };

    return ( <>
        <Header title={"Liste des événements"} other={<button className="btn btn-outline-primary" onClick={() => setShow({["value"]: "new", ["state"]: !show.state})}>Ajouter un événement</button>}/>
        {show.state && <EventPage id={show.value}/>}
        <table className="table table-hover">
            <thead>
            <tr>
                <th>Nom</th>
                <th>description</th>
                <th>date</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {events.map(event =>
                <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.description}</td>
                    <td>{DateFunctions.dateFormatFr(event.date)}{typeof event.endDate != 'undefined' && " au " + DateFunctions.dateFormatFr(event.endDate)}</td>
                    <td>
                        <button className="btn btn-sm btn-outline-primary mr-3" onClick={() => setShow({["value"]: event.id, ["state"]: true})}>Modifier l'événement</button>
                        <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </>);
}
export default EventsPage;
