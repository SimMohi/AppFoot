import React, { useState, useEffect } from "react";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";
import authAPI from "../services/authAPI";

const CompetitionsPage = props => {
    const superAdmin = authAPI.getIsSuperAdmin();
    const [competitions, setCompetitions] = useState([]);
    const [reload, setReload] = useState(0);
    const [show, setShow] = useState(false);
    const [select, setSelect] = useState({
        id: "",
        name: "",
    })
    const FindCompetitions = async () => {
        try {
            const data = await CompetitionsAPI.findAll();
            setCompetitions(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect( () => {
        FindCompetitions();
    }, [reload]);


    const handleDelete = id => {
        const originalCompetitions = [...competitions];
        setCompetitions(competitions.filter(competition => competition.id !== id));
        try {
            CompetitionsAPI.deleteCompet(id);
            setCompetitions(data);
        } catch (error) {
            console.log(error.response);
        }
        setShow(false);
    };

    const visible = async (id, visible) => {
        const data = {
            id: id,
            visible: visible
        }
        try{
            await CompetitionsAPI.competVisible(data);
        } catch (e) {

        }
        setReload(reload+1);
    }

    const openModal = (compet) => {
        setShow(true);
        setSelect({
            id: compet.id,
            name: compet.name
        })
    }

    return ( <>
        <h1>Liste des compétitions</h1>
        <Link to={"/competition/new/"} className={"btn btn-warning mb-3 float-right"}>Nouvelle compétition</Link>
        <table className="table table-hover whiteBorder">
            <thead>
            <tr>
                <th>Nom</th>
                <th>Saison</th>
            </tr>
            </thead>
            <tbody>
            {competitions.map(competition =>
                <tr key={competition.id}>
                    <td>{competition.name}</td>
                    <td>{competition.season}</td>
                    <td>
                        <Link to={"/competition/"+competition.id+"/view"} className={"btn btn-sm btn-outline-warning mr-3"}>Sélectionner</Link>
                        <Link to={"/competition/"+competition.id} className={"btn btn-sm btn-warning mr-3"}>Editer</Link>
                        {competition.visible && superAdmin &&
                            <>
                        <button onClick={() => visible(competition.id, false)}
                                className="btn btn-sm btn-outline-danger mr-3">Rendre invisible</button>
                        <button onClick={() => openModal(competition)}
                            className="btn btn-sm btn-danger">Supprimer</button>
                        </>
                        ||
                            <>
                        <button onClick={() => visible(competition.id, true)}
                                className="btn btn-sm btn-outline-warning mr-3">Rendre visible</button>

                        <button onClick={() => openModal(competition)}
                                className="btn btn-sm btn-danger">Supprimer</button>
                            </>
                        }
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                Supprimer mon profil
            </Modal.Header>
            <Modal.Body className={""}>
                <div>
                    <div className={"text-danger"}>
                        <p>Êtes vous sûr, de vouloir supprimer la compétition {select.name} ? <br/>
                            Toutes les informations seront perdues. <br/> </p>
                    </div>
                    <Field placeholder={"Votre mot de passe"} type={"password"}/>
                </div>
                <button onClick={()=>handleDelete(select.id)} className="btn btn-danger">
                    Oui, je suis sûr
                </button>
            </Modal.Body>
        </Modal>
    </>);
}
export default CompetitionsPage;
