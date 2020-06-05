import React, {useContext, useEffect, useState} from "react";
import authAPI from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";
import axios from 'axios';
import jwtDecode from "jwt-decode";
import usersAPI from "../services/usersAPI";
import Modal from "react-bootstrap/Modal";
import PlayerMatchAPI from "../services/PlayerMatchAPI";
import {USERS_API} from "../config";
import NotificationAPI from "../services/NotificationAPI";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import DateFunctions from "../services/DateFunctions";
import Field from "./forms/Fields";


const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [notifications, setNotifications] = useState({
        convocations: [],
        notif: []
    });
    const [justification, setJustification] = useState({
        reason: "",
        player: {},
        type: "",
    })
    const [show, setShow] = useState([false, false]);
    const admin = authAPI.getIsAdmin();
    const [reload, setReload] = useState(0);

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

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        toast.info("Vous êtes désormais déconnecté");
    };

    const fetchNotifications = () =>{
        const token = window.localStorage.getItem(("authToken"));
        if (token) {
            const {username: user} = jwtDecode(token);
            axios.all([
                axios.get(USERS_API +"?email=" + user),
            ]).then(axios.spread(async (...responses) => {
                const id = responses[0]["data"]["hydra:member"][0].id;
                const response = await usersAPI.getNotifications(id);
                const newNotifs = {
                    convocations: response.convocations,
                    notif: response.notif
                }
                setNotifications(response);
            })).catch(errors => {
                console.log(errors.response);
            })
        }
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setJustification({...justification, [name]: value});
    };

    const acceptMatch = async (player, type) => {
        try {
            if (type == "amical"){
                const userTeam = player.userTeam.replace("/api/user_teams/", "");
                const unOfficialMatch = player.unOfficialMatch.replace("/api/un_official_matches/", "");
                let post = {
                    userTeam: userTeam,
                    unOfficialMatch: unOfficialMatch,
                    accept: true
                }
                await UnOfficialMatchAPI.updatePlayer(post)
            } else if (type == "officiel"){
                player["hasConfirmed"] = true;
                delete player["goal"];
                delete player["yellowCard"];
                delete player["redCard"];
                await PlayerMatchAPI.update(player.id, player);
            }
            toast.success("Vous avez accepté la convocation");
        } catch (e) {
        }
        setReload(reload+1);
    }

    const deleteNotif = async (player, type) => {
        try {
            if (type == "amical"){
                const userTeam = player.userTeam.replace("/api/user_teams/", "");
                const unOfficialMatch = player.unOfficialMatch.replace("/api/un_official_matches/", "");
                let post = {
                    userTeam: userTeam,
                    unOfficialMatch: unOfficialMatch,
                    accept: false,
                    reason: justification.reason
                }
                await UnOfficialMatchAPI.updatePlayer(post);
                handleClose(1);
            } else if (type == "officiel") {
                player["hasRefused"] = true;
                player["refusedJustification"] = justification.reason;
                delete player["goal"];
                delete player["yellowCard"];
                delete player["redCard"];
                await PlayerMatchAPI.update(player.id, player);
                handleClose(1);
            }
            toast.error("Vous avez refusé la convocation");

        } catch (e) {
        }
        setReload(reload+1);
    }

    const seenNotif = async (notifId) => {
        try {
            await NotificationAPI.seenNotif({id: notifId});
        } catch (e) {
        }
        setReload(reload+1);
    }

    const justif = (player, type) => {
        handleShow(1);
        setJustification({
            reason: "",
            player: player,
            type: type,
        })
    }

    useEffect(() => {
        fetchNotifications();
    }, [reload]);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
                <NavLink className="navbar-brand" to={"/"}>
                    Mon Calendrier
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarColor01"
                    aria-controls="navbarColor01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        {isAuthenticated &&
                            <>
                                <li className="nav-item active">
                                    <NavLink className="nav-link" to={"/competition"}>
                                        Competitions
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/club"}>
                                        Clubs
                                    </NavLink>
                                </li>
                                {admin &&
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to={"/equipeRonvau"}>
                                                Gestion des équipes
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to={"/userAccess"}>
                                                Gestion des accès
                                            </NavLink>
                                        </li>
                                    </>
                                    ||
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to={"/equipeRonvau"}>
                                            Mes équipes
                                        </NavLink>
                                    </li>
                                }
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/events"}>
                                        Evenements
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/covoit"}>
                                        Covoiturage
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/chat"}>
                                        Chat
                                    </NavLink>
                                </li>

                            </>
                        }
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {!isAuthenticated && <>
                            <li className="nav-item">
                                <NavLink to={"/register"} className="btn btn-light ml-2 mr-2">
                                    Inscription
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/login"} className="btn btn-light ml-2 mr-2">
                                    Connexion
                                </NavLink>
                            </li>
                        </> ||
                            <>
                                <li className="nav-item">
                                    <img src="img/flag-regular.svg" alt=""/>
                                    <button type={"button"} onClick={() => handleShow(0)}>
                                        {notifications.convocations.length+notifications.notif.length}
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={"/profil"} className="btn btn-danger ml-2 mr-2">
                                        Mon profil
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className={"btn btn-danger"}>Déconnexion</button>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
            <Modal show={show[0]} onHide={() => handleClose(0)}>
                <Modal.Header closeButton>
                    Notifications
                </Modal.Header>
                <Modal.Body className={""}>
                    {notifications["convocations"].map((not, index) =>
                        <div key={index} className={"container"}>
                            <h5>{not.name}</h5>
                            <div className="row">
                                <div className="col-9">
                                    <p>Vous avez été convoqué pour le match : {not.match}</p>
                                </div>
                                <div className="col-3">
                                    <button onClick={() => acceptMatch(not["joueur"], not["type"])} className={"btn btn-sm btn-success mb-1"}>Accepter</button>
                                    <button onClick={() => justif(not["joueur"], not["type"])} className={"btn btn-sm btn-danger"}>Refuser</button>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    )}
                    {notifications["notif"].map((not, index) =>
                        <div key={index} className={"container"}>
                            <div className="row">
                                <div className="col-9">
                                    {not.message}
                                </div>
                                <div className="col-3">
                                    <button onClick={() => seenNotif(not.id)} className="btn btn-sm btn-primary">D'accord</button>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={show[1]} onHide={() => handleClose(1)}>
                <Modal.Header closeButton>
                    Justifier Refus
                </Modal.Header>
                <Modal.Body className={""}>
                    <Field type={"text"} value={justification.reason} onChange={handleChange} name={"reason"} label={"Raison de l'absence:"}/>
                    <button onClick={() => deleteNotif(justification.player, justification.type)} className="btn btn-success">Enregistrer</button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Navbar;
