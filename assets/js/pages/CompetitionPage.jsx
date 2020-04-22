import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";

const CompetitionPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);

    const [competition, setCompetition] = useState({
        name: "",
        format: "",
        season: "",
        matchDayNumber: "",
        teams: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        format: "",
        season: "",
        matchDayNumber: ""
    });

    const fetchCompetition = async id => {
        try{
            const { name, format, season, matchDayNumber, teams} = await CompetitionsAPI.find(id);
            setCompetition({ name, format, season, matchDayNumber, teams});
        } catch (e) {
            console.log(e.response);
        }
    };

    const handleChangeCompet = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCompetition({...competition, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing){
                await CompetitionsAPI.update(id, competition);
                toast.success("La compétition a bien été modifiée");
            } else {
                await CompetitionsAPI.create(competition);
                toast.success("La compétition a bien été créée");
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


    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCompetition(id);
        }
    }, [id]);

    return  (
        <>
            {!editing && <h1>Création d'une nouvelle Compétition</h1> ||
            <div className={"container"}>
                <div className="row">
                    <h1 className={"col-8"}>Modification d'une Compétition</h1>
                    <div className="col-4">
                        <Link to={"/competition/"+id+"/équipes"} className={"btn btn-primary mt-3 float-right"}>Gérer les équipes</Link>
                    </div>
                </div>
            </div>}
            <form onSubmit={handleSubmit}>
                <Field name={"name"} label={"Nom de la Compétition"} type={"text"} value={competition.name} onChange={handleChangeCompet} error={errors.name}/>
                <Field name={"format"} label={"Format de la Compétition"} type={"text"} value={competition.format} onChange={handleChangeCompet} error={errors.format}/>
                <Field name={"season"} label={"Saison pendant laquelle se déroule la compétition"} type={"text"} value={competition.season} onChange={handleChangeCompet} error={errors.season}/>
                <Field name={"matchDayNumber"} label={"Nombre de journées de championnat"} type={"number"} min={"1"} value={competition.matchDayNumber} onChange={handleChangeCompet}
                       error={errors.matchDayNumber}></Field>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/competition"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CompetitionPage;

