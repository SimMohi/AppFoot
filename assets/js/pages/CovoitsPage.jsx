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
import {CARS_API, PASSENGERS_API} from "../config";
import DateFunctions from "../services/DateFunctions";
import NotificationAPI from "../services/NotificationAPI";

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
        numberPassenger:"1",
        isAccepted: "",
        fromHome: true,
        street: "",
        code: "",
        city: "",
        number: ""
    })

    const [errors, setErrors] = useState({
        street: "",
        code: "",
        city: "",
        number: "",
        numberPassenger:"",
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
            let futurCar = [];
            for (let i = 0; i < data.length; i++){
                if (new Date(data[i]["date"]) > new Date()){
                    futurCar.push(data[i]);
                }
            }
            futurCar.sort(DateFunctions.orderByDate);
            setCovoits(futurCar);
        } catch (error) {
            console.log(error.response);
        }
    }


    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        if (name == "fromHome"){
            const homeVal = !newPassengers.fromHome
            setNewPassengers({...newPassengers, [name]: homeVal});
        } else {
            setNewPassengers({...newPassengers, [name]: value});
        }
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
                return <button onClick={() => unSubscribe(passengers[i]["@id"], covoit)} className="btn btn-sm btn-danger mr-3">Se désinscrire</button>;
            }
        }
        if (placeRemaining == 0){
            return <button className="btn btn-sm btn-warning mr-3" disabled={true}>&nbsp;&nbsp;&nbsp;&nbsp;S'inscire&nbsp;&nbsp;&nbsp;&nbsp;</button>;
        }
        if (covoit.userId["@id"] == userConnected["@id"]){
            return (
            <>
                <Link to={"/covoit/"+covoit.id} className="btn btn-warning btn-sm mr-3">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Modifier&nbsp;&nbsp;&nbsp;&nbsp;
                </Link>
                <button onClick={() => handleDelete(covoit.id)} className={"btn btn-danger btn-sm"}>Supprimer</button>
            </>)
        }
        return <button onClick={() => handleShow(covoit, 1)} className="btn btn-sm btn-warning mr-3">&nbsp;&nbsp;&nbsp;&nbsp;S'inscire&nbsp;&nbsp;&nbsp;&nbsp;</button>;
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
        copyNewPass["user"] = userConnected["id"];
        copyNewPass["car"] = modalParam["id"];
        copyNewPass["isAccepted"] = false;
        try{
            const response = await CovoitAPI.addPassenger(copyNewPass);
            await NotificationAPI.newNotifCarPass(copyNewPass);
            if (typeof response.data.violations != "undefined" && response.data.violations.length > 0){
                const apiErrors = {};
                response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.title;
                });
                setErrors(apiErrors);
                return ;
            }
            if (response.data.status == 500){
                toast.error(response.data.message);
                return ;
            }
            toast.success("Votre demande pour le covoiturage est enregistrée");
        } catch (e) {
            toast.error("Votre demande a échouée");
        }
        setReload(reload+1);
        let copyShow = JSON.parse(JSON.stringify(show));
        copyShow[1] = false;
        setShow(copyShow);
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
                axios.put(CARS_API + "/" + copyCovoit["id"], copyCovoit),
                axios.post(PASSENGERS_API, newPassenger),
            ])
            toast.success("Vous vous êtes bien inscrit au covoiturage");
        } catch (e) {
            toast.error("L'inscription au covoiturage a échoué");
        }
        setReload(reload+1);
    }

    const unSubscribe =  (id, covoit) => {
        id = id.replace("/api/car_passengers/", "");
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
                axios.delete(PASSENGERS_API + "/"+ id),
                ])
        } catch (e) {
            toast.error("La désinscription a échoué");
        }
        setReload(reload+1);
    }

    const adresseFormat = (address) => {
        address.street = address.street.toLowerCase();
        address.street = address.street.replace("rue", "");
        return "rue " + address.street + " " + address.number + ", " + address.code + " " + address.city
    }


    useEffect( () => {
        findCovoits();
        getUserConnected();
    }, [show, reload]);

    return(
        <>
            <h1>Espace covoiturage </h1>
            <button onClick={() => handleShow("new",0)}
                    className="btn btn btn-danger float-right mb-3">
                Nouveau covoiturage
            </button>
            <table className="table table-hover text-center whiteBorder p-3">
                <thead>
                <tr className={"row ml-3 mr-3"}>
                    <th className={"col-2"}>Conducteur</th>
                    <th className={"col-2"}>Titre</th>
                    <th className={"col-1"}>Date et heure</th>
                    <th className={"col-1"}>places restantes</th>
                    <th className={"col-3"}>Adresse de départ</th>
                    <th className={"col-3"}></th>
                </tr>
                </thead>
                <tbody>
                {covoits.map((covoit, index) =>
                    <tr key={index} className={"row ml-3 mr-3"}>
                        <td className={"col-2"}>{covoit.userId["firstName"]+" "+covoit.userId["lastName"]}</td>
                        <td className={"col-2"}>{covoit.title}</td>
                        <td className={"col-1"}>{DateFunctions.dateFormatFrDMHM(covoit.date, 1)}</td>
                        <td className={"col-1"}>{covoit.placeRemaining}</td>
                        <td className={"col-3"}>{adresseFormat(covoit.departureAddress)}</td>
                        <td className={"col-3"}>
                            {chooseButton(covoit)}
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
                        <div className={"custom-control custom-checkbox mb-4"}>
                            <input type="checkbox" className="custom-control-input" name={"fromHome"} id={"home"} checked={newPassengers.fromHome} onChange={handleChange}/>
                            <label className="custom-control-label" htmlFor={"home"}>Départ de mon domicile</label>
                        </div>
                        {!newPassengers.fromHome &&
                        <>
                            <div className="row">
                                <div className="col-9">
                                    <Field name={"street"} label={"Rue"} type={"text"} value={newPassengers.street} onChange={handleChange} error={errors.street}/>
                                </div>
                                <div className="col-3">
                                    <Field name={"number"} label={"Numéro"} type={"number"} value={newPassengers.number} onChange={handleChange} error={errors.number}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-7">
                                    <Field name={"city"} label={"Ville"} type={"text"} value={newPassengers.city} onChange={handleChange}/>
                                </div>
                                <div className="col-5">
                                    <Field name={"code"} label={"Code postal"} type={"number"} min={1000} max={9999} value={newPassengers.code} onChange={handleChange} />
                                </div>
                            </div>
                        </>
                        }
                        <Field type={"text"} placeholder={"Commentaire pour le conducteur"} name={"comment"} value={newPassengers["comment"]} onChange={handleChange}/>
                        <Field type={"number"} placeholder={"Nombre de personnes que vous voulez inscrire"} name={"numberPassenger"} min={1} max={modalParam.placeRemaining}
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