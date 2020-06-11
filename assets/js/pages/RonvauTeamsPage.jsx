import React, { useState, useEffect } from 'react';
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import CovoitPage from "./CovoitPage";
import Field from "../components/forms/Fields";
import {toast} from "react-toastify";


const RonvauTeamsPage = () => {

    const [reload, setReload] = useState(0);
    const [newTeam, setNewTeam] = useState({
        category: "",
    })

    const [errors, setErrors] = useState({
        category: "",
    })

    const [show, setShow] = useState([false, false]);

    const handleShow = (i) => {
        let showCopy = [...show];
        showCopy[i] = true;
        setShow(showCopy);
    }

    const handleClose = (i) => {
        let showCopy = [...show];
        showCopy[i] = false;
        setShow(showCopy);
    }
    const [ronvauTeams, setRonvauTeams] = useState([]);

    const FindRonvauTeam = async () => {
        try {
            const data = await RonvauTeamAPI.findAll();
            setRonvauTeams(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleDelete = id => {
        const originalRonvauTeam = [...ronvauTeams];
        setRonvauTeams(ronvauTeams.filter(ronvauTeams => ronvauTeams.id !== id));
        try {
            RonvauTeamAPI.deleteTeamRonvau(id);
        } catch (error) {
            setRonvauTeams(originalRonvauTeam)
        }
    };

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setNewTeam({...newTeam, [name]: value});
    };

    const handleSubmit = async () => {
        try {
            await RonvauTeamAPI.create(newTeam);
            toast.success("équipe créée avec succès");
            handleClose(0);
        } catch (error) {
            if(error.response.data.violations){
                console.log(error.response.data.violations);
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("La création de l'équipe a échoué");
        }
        setReload(reload+1);
    }

    useEffect( () => {
        FindRonvauTeam();
    }, [reload]);

    return ( <>
        <h1 className={"mb-5"}>Liste des équipes</h1>
        <button onClick={() => handleShow(0)} className="btn btn-outline-danger float-right mb-3">Nouvelle équipe</button>
        <table className="table table-hover text-center whiteBorder">
            <thead>
            <tr>
                <th>Catégorie</th>
                <th>Nombre de joueurs</th>
            </tr>
            </thead>
            <tbody>
            {ronvauTeams.map(ronvauTeam =>
                <tr key={ronvauTeam.id}>
                    <td>{ronvauTeam.category}</td>
                    <td>{ronvauTeam["userTeams"].length}</td>
                    <td>
                        <Link to={"/equipeRonvau/"+ronvauTeam.id+"/select"} className={"btn btn-sm btn-warning mr-3"}>Sélectionner</Link>
                        <Link to={"/equipeRonvau/"+ronvauTeam.id} className={"btn btn-sm btn-outline-warning mr-3"}>Editer</Link>
                        <button onClick={() => handleDelete(ronvauTeam.id)} className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        <Modal show={show[0]} onHide={() => handleClose(0)}>
            <Modal.Header closeButton>
                <h6>Création d'une nouvelle équipe</h6>
            </Modal.Header>
            <Modal.Body>
                <Field name={"category"} label={"Catégorie de l'équipe"} type={"text"} value={newTeam.category} onChange={handleChange} error={errors.category}/>
                <div className="from-group mt-3 float-right">
                    <button type={"button"}  onClick={handleSubmit} className="btn btn-warning">Enregistrer</button>
                </div>
            </Modal.Body>
        </Modal>
    </>);
}

export default RonvauTeamsPage;