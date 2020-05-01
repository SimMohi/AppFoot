import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";
import EventsAPI from "../services/EventsAPI";
import DateFunctions from "../services/DateFunctions";
import ReactSearchBox from "react-search-box";
import RonvauTeamAPI from "../services/RonvauTeamAPI";

const EventPage = props => {

    const id = props.id;
    const [editing, setEditing] = useState(false);
    const [ronvauTeams, setRonvauTeams] = useState([]);
    const [selectRt, setSelectRt] = useState([]);
    const [selectAll , setSelectAll] = useState(false);
    const [originalEventsTeam, setOriginalEventsTeam] = useState(false);


    const [event, setEvent] = useState({
        name: "",
        description: "",
        date: DateFunctions.todayFormatYMD(),
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
            let { name, description, date, eventsTeams} = await EventsAPI.find(id);
            date = DateFunctions.dateFormatYMD(date);
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
            setEvent({ name, description, date, eventsTeams});
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
            fetch();
        }
    }, [id]);

    console.log(selectRt);

    return  (
        <>
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
                                <Field name={"date"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Jour de l'événement"} type={"date"} value={event.date} onChange={handleChange} error={errors.date}/>
                                <div className="from-group">
                                    <button type={"button"} onClick={handleSubmit} className="btn btn-success">Enregistrer</button>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check ">
                                    <input className="form-check-input" type="checkbox" id={"allRt"} checked={selectAll} onChange={selectAllRt}/>
                                    <label className="form-check-label" htmlFor={"allRt"}>
                                        Inviter toutes les équipes
                                    </label>
                                </div>
                                {ronvauTeams.map((rt, index) =>
                                    <div key={index} className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={selectRt[index]["value"]} onChange={() => changeSelect(index)} id={"rt"+ rt.id}/>
                                        <label className="form-check-label" htmlFor={"rt"+ rt.id}>
                                            {rt.category}
                                        </label>
                                    </div>
                                )}
                                <button type={"button"} onClick={addTeams} className="btn btn-outline-primary mt-3">Inviter</button>
                            </div>
                        </>
                        ||
                        <div className={"mb-5 col-12"}>
                            <Field name={"name"} label={"Nom de l'événement"} type={"text"} value={event.name} onChange={handleChange} error={errors.name}/>
                            <Field name={"description"} label={"Description de l'événement"} type={"text"} value={event.description} onChange={handleChange} error={errors.description}/>
                            <Field name={"date"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Jour de l'événement"} type={"date"} value={event.date} onChange={handleChange} error={errors.date}/>
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

