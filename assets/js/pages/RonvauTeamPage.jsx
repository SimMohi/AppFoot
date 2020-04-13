import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";
import TeamsAPI from "../services/TeamsAPI";
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import RonvauTeamAPI from "../services/RonvauTeamAPI";

const RonvauTeamPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);

    const [ronvauTeam, setRonvauTeam] = useState({
        category: "",
        coach: "",
    });
    const [errors, setErrors] = useState({
        category: "",
        coach: "",
    });


    const fetchRonvauTeam = async id => {
        try {
            const { category, coach} = await RonvauTeamAPI.find(id);
            setRonvauTeam({ category, coach});
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setRonvauTeam({...ronvauTeam, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing){
                await RonvauTeamAPI.update(id, ronvauTeam);
                toast.success("L'équipe a bien été modifiée");
                props.history.replace("/equipeRonvau");
            } else {
                await RonvauTeamAPI.create(ronvauTeam);
                toast.success("L'équipe a bien été créée");
                props.history.replace("/equipeRonvau");
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
            fetchRonvauTeam(id);
        }
    }, [id]);

    return  (
        <>
            {!editing && <h1>Création d'une nouvelle équipe</h1> || <h1>Modification d'une équipe</h1>}
            <form onSubmit={handleSubmit}>
                <Field name={"category"} label={"Catégorie de l'équipe"} type={"text"} value={ronvauTeam.category} onChange={handleChange} error={errors.category}/>
                <Field name={"coach"} label={"Coach de l'équipe"} type={"text"} value={ronvauTeam.coach} onChange={handleChange} error={errors.coach}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/equipeRonvau"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    );
}

export default RonvauTeamPage;