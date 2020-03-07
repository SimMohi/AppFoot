import React from "react";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
            <a className="navbar-brand" href="#">
                Navbar
            </a>
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
                        <a className="nav-link" href="#">
                            Home <span className="sr-only">(current)</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Features
                        </a>
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
                    <li className="nav-item">
                        <a href="#" className="btn btn-light ml-2 mr-2">
                            Connexion
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-primary ml-2 mr-2">
                            Inscription
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
