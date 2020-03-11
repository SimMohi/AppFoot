import React, { useState } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import axios from 'axios';

const CompetitionPage = props => {

    const [competition, setCompetition] = useState({
        name: "",
        format: "",
        season: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        format: "",
        season: "",
    })

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCompetition({...competition, [name]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios
                .post('http://localhost:8000/api/competitions', competition)
            console.log(response.data);
        } catch (error) {
            console.log(error.response);
        }
    };


    return  (
        <>
            <h1>Création d'une nouvelle Compétition</h1>

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