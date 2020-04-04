import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import ClubsAPI from "../services/ClubsAPI";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ClubPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [club, setClub] = useState({
        name: "",
        address: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        address: "",
    });

    const fetchClub = async id => {
        try {
            const { name, address } = await ClubsAPI.find(id);
            setClub({ name, address });
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchClub(id);
        }
    }, [id]);


    const handleChange = ({ currentTarget }) => {
        console.log("cou");
        const { name, value } = currentTarget;
        setClub({...club, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing){
                const response = await ClubsAPI.update(id, club);
                toast.success("Le club a bien été modifié");
            } else {
                const response = await ClubsAPI.create(club);
                toast.success("Le club a bien été créé");
                props.history.replace("/club");
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

    return(
        <>
            {!editing && <h1>Création d'un nouveau Club</h1> || <h1>Modification d'un Club</h1>}
            <form onSubmit={handleSubmit}>
                <Field name={"name"} label={"Nom du club"} type={"text"} value={club.name} onChange={handleChange} error={errors.name}/>
                <Field name={"address"} label={"Adresse du club"} type={"text"} value={club.address} onChange={handleChange} error={errors.format}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/club"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    )
}

export default ClubPage;