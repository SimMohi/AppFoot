import React,{ useState, useContext} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Fields";
import axios from 'axios';
import {API_URL, USERS_API} from "../config";
import {Modal} from "react-bootstrap";

const LoginPage = ({ history}) => {
    const {setIsAuthenticated} = useContext(AuthContext);

    const [show, setShow] = useState(false);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    const [error, setError] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const firstResponse = await Promise.all([
                    axios.post(API_URL + "/api/login_check", credentials),
                ]
            )
            const token = firstResponse[0]["data"]["token"];
            window.localStorage.setItem("authToken", token);
            authAPI.setAxiosToken(token);
            const secondResponse = await axios.get(USERS_API +"?email="+ credentials["username"]);
            const isAccepted = secondResponse["data"]["hydra:member"][0]["isAccepted"];
            if (isAccepted == false){
                setError("L'utilisateur n'a pas encore été accepté par un administrateur");
                authAPI.logout();
            } else {
                setIsAuthenticated(true);
                history.replace("/");
                setError("");
            }
        } catch (e) {
            setError("Le nom d'utilisateur et le mot de passe ne correspondent pas");
        }
    };

    return (
        <>
            <h1 className={"text-center mb-5"}>Bienvenue sur la plateforme du FC Ronvau Chaumont</h1>

            <div className="d-flex justify-content-center mt-5">
                <form action="" onSubmit={handleSubmit} className={"col-6 whiteBorder p-3"}>
                    <Field label={"Adresse email"} name={"username"} value={credentials.username}
                           placeholder={'Adresse email de Connexion'} onChange={handleChange} type={"email"} error={error}/>
                    <Field label={"Mot de passe"} name={"password"} placeholder={"Votre mot de passe"} value={credentials.password} onChange={handleChange}
                           type={"password"} error={""}/>
                    <div className="form-group">
                        <button type={"button"} className={"btn btn-link text-warning"} onClick={()=> setShow(true)}>Mot de passe oublié ?</button>
                        <button type={"submit"} className={"btn btn-danger float-right"}>Se connecter</button>
                    </div>
                </form>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Réinitialisez votre mot de passe
                </Modal.Header>
                <Modal.Body className={""}>
                    <Field type={"email"} placeholder={"Votre Email"}/>
                    <div className={"form-group justify-content-end d-flex"}>
                        <button className="btn btn-danger">
                            Envoyer
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginPage;