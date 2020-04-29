import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";
import EventsAPI from "../services/EventsAPI";
import DateFunctions from "../services/DateFunctions";

const EventPage = props => {

    const id = props.id;

    const [editing, setEditing] = useState(false);

    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: DateFunctions.todayFormatYMD(),
    });

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        date: "",
    });



    const fetchEvent = async id => {
        try{
            let { name, description, date} = await EventsAPI.find(id);
            date = DateFunctions.dateFormatYMD(date);
            setEvent({ name, description, date});
        } catch (e) {
            console.log(e.response);
        }
    };

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setEvent({...event, [name]: value});
    };

    const handleSubmit = async () => {
        if (event.date == ""){
            const apiErrors = {};
            apiErrors["date"] = "La date n'est pas valide";
            setErrors(apiErrors);
            return ;
        }
        try {
            if (editing){
                await EventsAPI.update(id, event);
            } else {
                if (event.date < DateFunctions.todayFormatYMD()){
                    const apiErrors = {};
                    apiErrors["date"] = "La date est dépassée";
                    setErrors(apiErrors);
                    return ;
                }
                await EventsAPI.create(event);
            }
            setErrors({});
        } catch (error) {
            if(error.response.data.violations){
                console.log(error.response.data.violations);
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
        window.location.reload();
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchEvent(id);
        }
    }, [id]);

    return  (
        <>
            {!editing && <h5 className={"mb-3"}>Création d'un nouvel événement</h5> ||
            <div className={"container"}>
                <div className="row">
                    <h5 className={"col-8"}>Modification d'un événement</h5>
                </div>
            </div>}
            <div className={"mb-5"}>
                <Field name={"name"} label={"Nom de l'événement"} type={"text"} value={event.name} onChange={handleChange} error={errors.name}/>
                <Field name={"description"} label={"Description de l'événement"} type={"text"} value={event.description} onChange={handleChange} error={errors.description}/>
                <Field name={"date"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Jour de l'événement"} type={"date"} value={event.date} onChange={handleChange} error={errors.date}/>
                <div className="from-group">
                    <button type={"button"} onClick={handleSubmit} className="btn btn-success">Enregistrer</button>
                </div>
            </div>
        </>
    );
};

export default EventPage;

