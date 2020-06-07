import React, { useState, useEffect } from "react";
import EventsAPI from "../services/EventsAPI";
import DateFunctions from "../services/DateFunctions";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";

const EventsPage = props => {
    const [events, setEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({
        id: "",
        name:"",
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


    const handleDelete = () => {
        const originalEvents = [...events];
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        try {
            EventsAPI.deleteEvent(selectedEvent.id);
        } catch (error) {
            console.log(error.response);
            setEvents(originalEvents);
        }
        setShow(false);
    };

    const openModal = (event) => {
        setSelectedEvent({
            id: event.id,
            name: event.name
        })
        setShow(true);
    }

    return ( <>
        <Link to={"/events/new"} className={"btn btn-primary float-right"}>Créer un événement</Link>
        <h3 className={"mb-5"}>Liste des différents événements</h3>
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
                        <Link to={"/events/"+event.id+"/inscrit"} className={"btn btn-sm btn-success mr-3"}>Liste des inscrits</Link>
                        <Link to={"/events/"+event.id} className={"btn btn-sm btn-outline-primary mr-3"}>Modifier l'événement</Link>
                        <button onClick={() => openModal(event)} className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Body className={""}>
                <h6>Etes vous sûr de vouloir supprimer l'événement {selectedEvent.name} ? </h6>
                <h6>Cette action est irréversible.</h6>
                <button onClick={() => handleDelete()} className="btn btn-danger float-right">Supprimer</button>
            </Modal.Body>
        </Modal>
    </>);
}
export default EventsPage;
