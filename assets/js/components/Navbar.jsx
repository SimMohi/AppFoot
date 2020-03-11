import React, {useContext} from "react";
import authAPI from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        history.push("/login");
    };
    return (
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
                            Users
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Pricing
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            About
                        </a>
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
                        <li className="nav-item">
                            <button onClick={handleLogout} className={"btn btn-danger"}>Déconnexion</button>
                        </li>
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
