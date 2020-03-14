import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";

const CompetitionPage = props => {

    const {id} = props.match.params;

    const [competition, setCompetition] = useState({
        name: "comppet",
        format: "champ",
        season: "2019-2020",
    });

    const [errors, setErrors] = useState({
        name: "",
        format: "",
        season: "",
    });

    const [editing, setEditing] = useState(false);

    const fetchCompetition = async id => {
        try {
            const { name, format, season} = await CompetitionsAPI.find(id);
            setCompetition({ name, format, season});
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCompetition(id);
        }
    }, [id]);


    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCompetition({...competition, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing){
                const response = await CompetitionsAPI.update(id, competition)
            } else {
                const response = await CompetitionsAPI.create(competition);

                props.history.replace("/competition");
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
    };


    return  (
        <>
            {!editing && <h1>Création d'une nouvelle Compétition</h1> || <h1>Modification d'une Compétition</h1>}


            <form onSubmit={handleSubmit}>
                <Field name={"name"} label={"Nom de la Compétition"} type={"text"} value={competition.name} onChange={handleChange} error={errors.name}/>
                <Field name={"format"} label={"Format de la Compétition"} type={"text"} value={competition.format} onChange={handleChange} error={errors.format}/>
                <Field name={"season"} label={"Saison pendant laquelle se déroule la compétition"} type={"text"} value={competition.season} onChange={handleChange} error={errors.season}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/competition"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CompetitionPage;