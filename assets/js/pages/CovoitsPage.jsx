import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CovoitPage from "./CovoitPage";
import CovoitAPI from "../services/CovoitAPI";
import Moment from "react-moment";
import {toast} from "react-toastify";
import authAPI from "../services/authAPI";
import axios from 'axios';
import Field from "../components/forms/Fields";

const CovoitsPage = props => {

    const [show, setShow] = useState([
        false, false
    ]);
    const [modalParam, setModalParam] = useState("");
    const [covoits, setCovoits] = useState([]);
    const [userConnected, setUserConnected] = useState({});
    const [reload, setReload] = useState(0);
    const [newPassengers, setNewPassengers] = useState({
        user: "",
        car: "",
        comment: "",
        numberPassenger:"",
        isAccepted: ""
    })

    const handleShow = (id, index) => {
        setModalParam(id);
        let showCopy = [...show];
        showCopy[index] = true;
        setShow(showCopy);
    }

    const handleClose = (index) => {
        let showCopy = [...show];
        showCopy[index] = false;
        setShow(showCopy);
    }

    const findCovoits = async () => {
        try {
            const data = await CovoitAPI.findAll();
            setCovoits(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setNewPassengers({...newPassengers, [name]: value});
    };

    const handleDelete = async id => {
        const originalsCovoit = [...covoits];
        setCovoits(covoits.filter(covoit => covoit.id !== id));
        try {
            await CovoitAPI.deleteCar(id);
            toast.success("Le covoiturage a bien été supprimé");
        } catch (error) {
            setCovoits(originalsCovoit);
            toast.error("La suppression a échoué");
        }
    };

    const chooseButton = covoit => {
        const placeRemaining = covoit["placeRemaining"];
        const passengers = covoit["carPassengers"];

        for(var i = 0; i < passengers.length; i++){
            if (passengers[i]["user"]["@id"] == userConnected["@id"]){
                return <button onClick={() => unSubscribe(passengers[i]["id"], covoit)} className="btn btn-sm btn-primary mr-3">Se désinscrire</button>;
            }
        }
        if (placeRemaining == 0){
            return <button className="btn btn-sm btn-success mr-3" disabled={true}>&nbsp;&nbsp;&nbsp;&nbsp;S'inscire&nbsp;&nbsp;&nbsp;&nbsp;</button>;
        }
        if (covoit.userId["@id"] == userConnected["@id"]){
            return <Link to={"/covoit/"+covoit.id} className="btn btn-primary btn-sm mr-3">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Modifier&nbsp;&nbsp;&nbsp;&nbsp;
            </Link>
        }
        return <button onClick={() => handleShow(covoit, 1)} className="btn btn-sm btn-success mr-3">&nbsp;&nbsp;&nbsp;&nbsp;S'inscire&nbsp;&nbsp;&nbsp;&nbsp;</button>;
    }

    const getUserConnected = async () => {
        try{
            const userInfo = await authAPI.getUserInfo();
            setUserConnected(userInfo[0]);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let copyNewPass = JSON.parse(JSON.stringify(newPassengers));
        copyNewPass["user"] = userConnected["@id"];
        copyNewPass["car"] = modalParam["@id"];
        copyNewPass["isAccepted"] = false;
        try{
            await CovoitAPI.addPassenger(copyNewPass);
            toast.success("Votre demande pour le covoiturage est enregistrée");
        } catch (e) {
            toast.error("Votre demande a échouée");
        }
        setReload(reload+1);
    }

    const subscribe =  (covoit) => {
        let copyCovoit = JSON.parse(JSON.stringify(covoit));
        copyCovoit["placeRemaining"] -= 1;
        copyCovoit["userId"] = copyCovoit["userId"]["@id"];
        for(var i = 0; i < copyCovoit["carPassengers"].length; i++){
            copyCovoit["carPassengers"][i] = copyCovoit["carPassengers"][i]["@id"];
        }
        const user = userConnected["@id"];
        const car = "/api/cars/"+covoit.id;
        const newPassenger = {user, car};

        try {
            axios.all([
                axios.put("http://localhost:8000/api/cars/" + copyCovoit["id"], copyCovoit),
                axios.post("http://localhost:8000/api/car_passengers", newPassenger),
            ])
            toast.success("Vous vous êtes bien inscrit au covoiturage");
        } catch (e) {
            toast.error("L'inscription au covoiturage a échoué");
        }
        setReload(reload+1);
    }

    const unSubscribe =  (id, covoit) => {
        let copyCovoit = JSON.parse(JSON.stringify(covoit));
        const idCovoit = copyCovoit["id"];
        copyCovoit["placeRemaining"] += 1;
        copyCovoit["userId"] = copyCovoit["userId"]["@id"];
        for(var i = 0; i < copyCovoit["carPassengers"].length; i++){
            copyCovoit["carPassengers"][i] = copyCovoit["carPassengers"][i]["@id"];
        }
        try {
            axios.all([
                //axios.put("http://localhost:8000/api/cars/" + idCovoit, copyCovoit),
                axios.delete("http://localhost:8000/api/car_passengers/"+ id),
                ])
        } catch (e) {
            toast.error("La désinscription a échoué");
        }
        setReload(reload+1);
    }


    useEffect( () => {
        findCovoits();
        getUserConnected();
    }, [show, reload]);

    return(
        <>
            <h1>Espace covoiturage </h1>
            <Button className="btn btn-primary float-right mb-3" onClick={() => handleShow("new",0)}>
                Nouveau covoiturage
            </Button>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Conducteur</th>
                    <th>Lieu de départ</th>
                    <th>Date et heure</th>
                    <th>places restantes</th>
                </tr>
                </thead>
                <tbody>
                {covoits.map((covoit, index) =>
                    <tr key={index}>
                        <td>{covoit.userId["firstName"]+" "+covoit.userId["lastName"]}</td>
                        <td>{covoit.departurePlace}</td>
                        <td>
                            <Moment format="YYYY-MM-DD HH:mm">
                                {covoit.date}
                            </Moment>
                        </td>
                        <td>{covoit.placeRemaining}</td>
                        <td>
                            {chooseButton(covoit)}
                            <button onClick={() => handleDelete(covoit.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show[0]} onHide={() => handleClose(0)}>
                <Modal.Header closeButton>
                    {modalParam != "new" && <Modal.Title>Modifier le covoiturage</Modal.Title> || <Modal.Title>Nouveau covoiturage</Modal.Title>}
                </Modal.Header>
                <Modal.Body><CovoitPage id={modalParam} user={userConnected}/></Modal.Body>
            </Modal>
            <Modal show={show[1]} onHide={() => handleClose(1)}>
                <Modal.Header closeButton>
                    Inscription au covoiturage
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <Field type={"text"} placeholder={"Commentaire pour le conducteur"} name={"comment"} value={newPassengers["comment"]} onChange={handleChange}/>
                        <Field type={"number"} placeholder={"Nombre de personnes que vous voulez inscrire"} name={"numberPassenger"} min={0} max={modalParam.placeRemaining}
                               onChange={handleChange} value={newPassengers["numberPassenger"]}/>
                        <div className="from-group">
                            <button type={"submit"} className="btn btn-success float-right">Enregistrer</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CovoitsPage;