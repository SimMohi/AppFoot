import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";
import EventsAPI from "../services/EventsAPI";
import DateFunctions from "../services/DateFunctions";
import ReactSearchBox from "react-search-box";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import Modal from "react-bootstrap/Modal";

const EventPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [ronvauTeams, setRonvauTeams] = useState([]);
    const [selectRt, setSelectRt] = useState([]);
    const [selectAll , setSelectAll] = useState(false);
    const [originalEventsTeam, setOriginalEventsTeam] = useState(false);


    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: DateFunctions.todayFormatYMD(),
        endDate:  DateFunctions.todayFormatYMD(),
        start : "00:00",
        end: "00:00",
        eventsTeams: [],
    });


    const [errors, setErrors] = useState({
        name: "",
        description: "",
        date: "",
    });

    const fetch = async () => {
        try {
            const data = await RonvauTeamAPI.findAll();
            let { name, description, date, eventsTeams, endDate} = await EventsAPI.find(id);
            console.log(endDate);
            const end = DateFunctions.getHoursHM(endDate, 1);
            const start = DateFunctions.getHoursHM(date, 1);
            date = DateFunctions.dateFormatYMD(date);
            endDate = DateFunctions.dateFormatYMD(endDate);
            console.log(end);
            let teams = [];
            for (let i = 0; i < eventsTeams.length; i++){
                setOriginalEventsTeam(true);
                teams.push(eventsTeams[i]["idTeamRonvau"]);
            }
            let selectArray = [];
            for (let i = 0; i < data.length; i++){
                if (teams.includes(data[i]["@id"])){
                    selectArray.push({id: data[i].id, value: true});
                } else {
                    selectArray.push({id: data[i].id, value: false});
                }
            }
            setSelectRt(selectArray);
            setRonvauTeams(data);
            setEvent({ name, description, date, eventsTeams, endDate, start, end});
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setEvent({...event, [name]: value});
    };

    const selectAllRt = () => {
        let copy = JSON.parse(JSON.stringify(selectRt));
        copy.map(rt => rt["value"] = !selectAll)
        setSelectRt(copy);
        setSelectAll(!selectAll);
    }

    const changeSelect = (index) => {
        let copy = JSON.parse(JSON.stringify(selectRt));
        copy[index]["value"] = !copy[index]["value"];
        setSelectRt(copy);
    }

    const addTeams = async () => {
        let post = {
            event: id,
            teams: []
        };
        for (let i = 0; i  < selectRt.length; i++){
            if (selectRt[i].value == false) continue;
            post.teams.push(selectRt[i].id);
        }
        if (post.teams.length < 1 && originalEventsTeam == false){
            toast.warn("Vous n'avez pas sélectionné d'équipe");
            return ;
        }
        try{
            await EventsAPI.addTeams(post);
            toast.success("Les équipes ont bien été ajoutées");
        } catch (e) {
            toast.error("les équipes n'ont pas été ajoutées");
        }
    }

    const handleSubmit = async () => {
        if (event.date == ""){
            const apiErrors = {};
            apiErrors["date"] = "La date n'est pas valide";
            setErrors(apiErrors);
            return ;
        }
        try {
            let copy = JSON.parse(JSON.stringify(event));
            copy["date"] = new Date(copy["date"]+" "+ copy["start"]);
            copy["endDate"] = new Date(copy["endDate"]+" "+ copy["end"]);
            if (copy["date"] > copy["endDate"]){
                toast.warn("Date de fin antérieur à celle de début");
                return ;
            }
            delete copy["eventsTeams"];
            if (editing){
                await EventsAPI.update(id, copy);
            } else {
                if (event.date < DateFunctions.todayFormatYMD()){
                    const apiErrors = {};
                    apiErrors["date"] = "La date est dépassée";
                    setErrors(apiErrors);
                    return ;
                }
                await EventsAPI.create(copy);
                toast.success("Evenement créé avec succès");
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
        window.history.back();
    };


    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetch();
        }
    }, [id]);

    return  (
        <>
            <Link to={"/events"} className={"btn btn-primary float-right mb-3"}>Retour à la liste</Link>
            {!editing && <h5 className={"mb-3"}>Création d'un nouvel événement</h5> ||
            <div className={"container"}>
                <div className="row">
                    <h5 className={"col-8"}>Modification d'un événement</h5>
                </div>
            </div>}
            <div className="container">
                <div className="row">
                    {editing &&
                        <>
                            <div className={"mb-5 col-6"}>
                                <Field name={"name"} label={"Nom de l'événement"} type={"text"} value={event.name} onChange={handleChange} error={errors.name}/>
                                <Field name={"description"} label={"Description de l'événement"} type={"text"} value={event.description} onChange={handleChange} error={errors.description}/>
                                <div className="row">
                                    <div className="col-6">
                                        <Field name={"date"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Jour de début l'événement"} type={"date"} value={event.date} onChange={handleChange} error={errors.date}/>
                                    </div>
                                    <div className="col-6">
                                        <Field name={"start"} label={"Heure de début"} type={"time"} value={event.start} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <Field name={"endDate"} label={"Jour de fin de l'événement"} type={"date"} value={event.endDate} onChange={handleChange} />
                                    </div>
                                    <div className="col-6">
                                        <Field name={"end"} label={"Heure de fin"} type={"time"} value={event.end} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="from-group">
                                    <button type={"button"} onClick={handleSubmit} className="btn btn-success">Enregistrer</button>
                                </div>
                            </div>
                            <div className="col-6">
                                <h5>Inviter des équipes à cet événement</h5>
                                <div className={"ml-5"}>
                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox ">
                                            <input className="custom-control-input" type="checkbox" id={"allRt"} checked={selectAll} onChange={selectAllRt}/>
                                            <label className="custom-control-label" htmlFor={"allRt"}>
                                                Inviter toutes les équipes
                                            </label>
                                        </div>
                                        {ronvauTeams.map((rt, index) =>
                                            <div key={index} className="custom-control custom-checkbox ">
                                                <input className="custom-control-input" type="checkbox" checked={selectRt[index]["value"]} onChange={() => changeSelect(index)} id={"rt"+ rt.id}/>
                                                <label className="custom-control-label" htmlFor={"rt"+ rt.id}>
                                                    {rt.category}
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    <button type={"button"} onClick={addTeams} className="btn btn-outline-primary mt-3">Inviter</button>
                                </div>
                            </div>
                        </>
                        ||
                        <div className={"mb-5 col-12"}>
                            <Field name={"name"} label={"Nom de l'événement"} type={"text"} value={event.name} onChange={handleChange} error={errors.name}/>
                            <Field name={"description"} label={"Description de l'événement"} type={"text"} value={event.description} onChange={handleChange} error={errors.description}/>
                            <div className="row">
                                <div className="col-6">
                                    <Field name={"date"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Date de début de l'événement"} type={"date"} value={event.date} onChange={handleChange} error={errors.date}/>
                                    <Field name={"start"} label={"heure de début"} type={"time"} value={event.start} onChange={handleChange} error={errors.date}/>
                                </div>
                                <div className="col-6">
                                    <Field name={"endDate"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Date de fin de l'événement"} type={"date"} value={event.endDate} onChange={handleChange}/>
                                    <Field name={"end"} label={"Heure de fin"} type={"time"} value={event.end} onChange={handleChange} error={errors.date}/>
                                </div>
                            </div>

                            <div className="from-group">
                                <button type={"button"} onClick={handleSubmit} className="btn btn-success">Enregistrer</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default EventPage;

