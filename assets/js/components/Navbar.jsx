import React, {useContext, useEffect, useState} from "react";
import authAPI from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";
import axios from 'axios';
import jwtDecode from "jwt-decode";
import usersAPI from "../services/usersAPI";
import Modal from "react-bootstrap/Modal";
import CovoitPage from "../pages/CovoitPage";
import Field from "./forms/Fields";
import PlayerMatchAPI from "../services/PlayerMatchAPI";


const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        toast.info("Vous êtes désormais déconnecté");
    };

    const fetchNotifications = async () =>{
        const token = window.localStorage.getItem(("authToken"));
        if (token) {
            const {username: user} = jwtDecode(token);
            axios.all([
                axios.get("http://localhost:8000/api/users?email=" + user),
            ]).then(axios.spread(async (...responses) => {
                const id = responses[0]["data"]["hydra:member"][0].id;
                const response = await usersAPI.getNotifications(id);
                setNotifications(response);
            })).catch(errors => {
                console.log(errors.response);
            })
        }
    }

    const test = (id) => {
        console.log(id);
    }

    const deleteNotif = async (player) => {
        player["hasRefused"] = true;
        delete player["goal"];
        delete player["yellowCard"];
        delete player["redCard"];
        console.log(player);
        try {
            await PlayerMatchAPI.update(player.id, player);
        } catch (e) {
            toast.error("L'entraînement n'a pas été supprimé");
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <>
            {/*<div className="wrapper">*/}
            {/*    <div className="sidebar bg-danger">*/}
            {/*        <ul>*/}
            {/*            <li><a href="#">*/}
            {/*                <span className="icon"><i className="fas fa-book"></i></span>*/}
            {/*                <span className="title">Books</span>*/}
            {/*            </a></li>*/}
            {/*            <li><a href="#">*/}
            {/*                <span className="icon"><i className="fas fa-file-video"></i></span>*/}
            {/*                <span className="title">Movies</span>*/}
            {/*            </a></li>*/}
            {/*            <li><a href="#">*/}
            {/*                <span className="icon"><i className="fas fa-volleyball-ball"></i></span>*/}
            {/*                <span className="title">Sports</span>*/}
            {/*            </a></li>*/}
            {/*            <li><a href="#" className="active">*/}
            {/*                <span className="icon"><i className="fas fa-blog"></i></span>*/}
            {/*                <span className="title">Blogs</span>*/}
            {/*            </a></li>*/}
            {/*            <li><a href="#">*/}
            {/*                <span className="icon"><i className="fas fa-leaf"></i></span>*/}
            {/*                <span className="title">Nature</span>*/}
            {/*            </a></li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
                <NavLink className="navbar-brand" to={"/"}>
                    Navbar
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
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/events"}>
                                Events
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/covoit"}>
                                Covoiturage
                            </NavLink>
                        </li>
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
                                    <button type={"button"} onClick={handleShow}>
                                        {notifications.length}
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    Convocations
                </Modal.Header>
                <Modal.Body className={""}>
                    {notifications.map((not, index) =>
                        <div key={index} className={"container"}>
                            <h5>{not.name}</h5>
                            <div className="row">
                                <div className="col-9">
                                    {not.match}
                                </div>
                                <div className="col-3">
                                    <img id={"greenCheck"} src="img/green_check.png" alt="" onClick={() => test(not["joueur"])}/>
                                    <img id={"redCross"} src="img/red_cross.png" alt="" onClick={() => deleteNotif(not["joueur"])}/>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Navbar;
