import React, { useState, useEffect } from 'react';
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import CovoitPage from "./CovoitPage";
import Field from "../components/forms/Fields";
import {toast} from "react-toastify";
import authAPI from "../services/authAPI";
import ClubsAPI from "../services/ClubsAPI";


const RonvauTeamsPage = () => {

    const isAdmin = authAPI.getIsAdmin();
    const isSuperAdmin = authAPI.getIsSuperAdmin();
    const [reload, setReload] = useState(0);
    const [modal2, setModal2] = useState(false);
    const [password, setPassword] = useState("");
    const [selectTeam, setSelectTeam] = useState({
        id: "",
        name: "",
    })
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
            const id = authAPI.getId();
            const data = await RonvauTeamAPI.isFollow(id);
            setRonvauTeams(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const follow = async  (id) => {
        await RonvauTeamAPI.follow({
            userId: authAPI.getId(),
            teamId: id
        })
        setReload(reload+1);
    }

    const unFollow = async  (id) => {
        await RonvauTeamAPI.unFollow({
            userId: authAPI.getId(),
            teamId: id
        })
        setReload(reload+1);
    }

    const handleDelete = id => {
        const originalRonvauTeam = [...ronvauTeams];
        if (password != "password"){
            toast.warn("mauvais mot de passe");
            return;
        }
        setRonvauTeams(ronvauTeams.filter(ronvauTeams => ronvauTeams.id !== id));
        try {
            RonvauTeamAPI.deleteTeamRonvau(id);
        } catch (error) {
            setRonvauTeams(originalRonvauTeam)
        }
        setModal2(false);
    };

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setNewTeam({...newTeam, [name]: value});
    };

    const changePass = ({ currentTarget }) => {
        setPassword(currentTarget.value);
    };


    const openDelete = (team) => {
        setModal2(true);
        setSelectTeam({
            id: team.id,
            name: team.category,
        })
    }

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

    const setVisible = async (visible, id) => {
        await ClubsAPI.setTeamInvisible({
            visible: visible,
            id: id
        })
        setReload(reload+1);
    }

    useEffect( () => {
        FindRonvauTeam();
    }, [reload]);

    return ( <div className={"container"}>
        <h1 className={"mb-5 text-center"}>Liste des équipes</h1>
        {isAdmin &&
        <button onClick={() => handleShow(0)} className="btn btn-outline-danger float-right mb-3">Nouvelle
            équipe</button>
        }
        <table className="table table-hover text-center whiteBorder">
            <thead>
            <tr>
                <th>Catégorie</th>
            </tr>
            </thead>
            <tbody>
            {ronvauTeams.map(ronvauTeam =>
                <tr key={ronvauTeam.id}>
                    <td><h6>{ronvauTeam.category}</h6></td>
                    <td className={"row justify-content-end mr-5"}>
                        {ronvauTeam["canFollow"] &&
                        <button onClick={() => follow(ronvauTeam.id)}
                                className="btn btn-sm mr-3 btn-outline-danger">Suivre</button>
                        }
                        {ronvauTeam["canUnFollow"] &&
                        <button onClick={() => unFollow(ronvauTeam.id)}
                                className="btn btn-sm mr-3 btn-outline-danger">Se désinscrire</button>
                        }
                        <Link to={"/equipeRonvau/"+ronvauTeam.id+"/select"} className={"btn btn-sm btn-warning mr-3"}>Sélectionner</Link>
                        {ronvauTeam["isStaff"] || isAdmin &&
                        <Link to={"/equipeRonvau/" + ronvauTeam.id}
                              className={"btn btn-sm btn-outline-warning mr-3"}>Editer</Link>
                        }
                        {isAdmin &&
                        (ronvauTeam.visible &&
                            <button onClick={() => setVisible(false, ronvauTeam.id)}
                                    className="btn btn-sm btn-danger">invisible</button>

                            ||
                            <button onClick={() => setVisible(true, ronvauTeam.id)}
                                    className="btn btn-sm btn-outline-danger">visbile</button>
                        )
                        }
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
        <Modal show={modal2} onHide={() => setModal2(false)}>
            <Modal.Body className={""}>
                <h6>Etes vous sûr de vouloir supprimer l'équipe {selectTeam.name} ? </h6>
                <h6>Cette action est irréversible. Les données seront perdues.</h6>
                <Field  type={'password'} value={password} onChange={changePass} name={"password"} placeholder={"Votre mot de passe"}/>
                <button onClick={() => handleDelete(selectTeam.id)} className="btn btn-danger float-right">Supprimer</button>
            </Modal.Body>
        </Modal>
    </div>);
}

export default RonvauTeamsPage;