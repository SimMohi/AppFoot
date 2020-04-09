import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import DateTimePicker from 'react-datetime-picker'
import CovoitAPI from "../services/CovoitAPI";
import {toast} from "react-toastify";
import axios from "axios";


const CovoitPage = props => {
    const {id} = props.match.params;
    const [reload, setReload] = useState(0);

    const [car, setCar] = useState({});

    const [carPass, setCarPass] = useState([])

    const [errors, setErrors] = useState({
        departurePlace: "",
        date: "",
        placeRemaining: "",
    });

    const fetchCar = async id => {
        try {
            const response = await CovoitAPI.find(id);
            setCar(response);
            setCarPass(response.carPassengers);
        } catch (error) {
            console.log(error.response);
        }
    };


    const handleChangeCar = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCar({...car, [name]: value});
    }

    const handleChangePass = ({ currentTarget }) => {
        const { name, value, id } = currentTarget;
        let copyCarpass = JSON.parse(JSON.stringify(carPass));
        copyCarpass[id][name] = value;
        setCarPass(copyCarpass);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let copyCar = JSON.parse(JSON.stringify(car));
        for (let i = 0; i < car["carPassengers"].length; i++){
            copyCar["carPassengers"][i] =  car["carPassengers"][i]["@id"];
        }
        try {
            const response = await CovoitAPI.update(id, copyCar);
            toast.success("Le covoiturage a bien été modifié");
            setErrors({});
        } catch (error) {
            if(error.response.data.violations){
                console.log(error.response.data.violations);
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
    }

    const accept = ({currentTarget}) =>{
        const { id } = currentTarget;
        let currentCar = JSON.parse(JSON.stringify(car));
        console.log(currentCar);
        for (let i = 0; i < currentCar["carPassengers"].length; i++){
            currentCar["carPassengers"][i] = currentCar["carPassengers"][i]["@id"];
        }
        let currentCarPass = carPass[id];
        currentCar["placeRemaining"] -= currentCarPass["numberPassenger"];
        currentCar["userId"] = currentCar["userId"]["@id"];
        currentCarPass["user"] = currentCarPass["user"]["@id"];
        currentCarPass["isAccepted"] = true;
        console.log(currentCar);
        try {
            axios.all([
                axios.put("http://localhost:8000/api/car_passengers/" + currentCarPass.id, currentCarPass),
                axios.put("http://localhost:8000/api/cars/"+ currentCar.id, currentCar),
            ]);
            toast.success("La demande a bien été acceptée");
        } catch (error) {
            toast.error("L'acceptation de la demande a échoué");
        }
        setReload(reload+1);
    }

    const handleDelete =  (id, numberPassenger) => {
        let currentCar = JSON.parse(JSON.stringify(car));
        for (let i = 0; i < currentCar["carPassengers"].length; i++){
            currentCar["carPassengers"][i] = currentCar["carPassengers"][i]["@id"];
        }
        currentCar["placeRemaining"] += numberPassenger;
        currentCar["userId"] = currentCar["userId"]["@id"];
        try {
            axios.all([
                axios.put("http://localhost:8000/api/cars/" + currentCar.id, currentCar),
                axios.delete("http://localhost:8000/api/car_passengers/"+ id),
            ]);
            toast.success("La demande a bien été supprimée");
        } catch (error) {
            toast.error("La suppression a échoué");
        }
        setReload(reload+1);
    };

    useEffect(() => {
        fetchCar(id);
    }, [id, reload]);


    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className={"w-50"}>
                    <Field name={"departurePlace"} label={"Lieu de départ"} type={"text"} onChange={handleChangeCar} error={errors.departurePlace} value={car.departurePlace || ""}/>
                    <Field name={"placeRemaining"} label={"Nombre de places disponibles"} type={"number"} min={1} onChange={handleChangeCar} error={errors.placeRemaining} value={car.placeRemaining || ""}/>
                </div>
                <h3 className={"m-4"}>Demandes</h3>
                <table className="table table-hover text-center">
                    <thead>
                    <tr>
                        <th>Etat</th>
                        <th>Passagers</th>
                        <th>commentaire</th>
                        <th>place</th>
                        <th>réponse</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {carPass.map((pass, index) =>
                            <tr key={pass.id}>
                                <td>{pass.isAccepted == false && <i className="far fa-clock"></i> || <i className="fas fa-check"></i>}</td>
                                <td>{pass["user"]["firstName"] +" "+ pass["user"]["lastName"]}</td>
                                <td>{pass["comment"]}</td>
                                <td>{pass["numberPassenger"]}</td>
                                <td><input className={"form-control"} value={pass["answer"]} onChange={handleChangePass} id={index} name={"answer"} type={"text"} placeholder={"Ajouter une précision, Ex: heure"} /></td>
                                <td>
                                    {pass.isAccepted == false && <button type={"button"} onClick={accept} id={index} className="btn btn-sm btn-success mr-3">Accepter</button>}
                                    <button type={"button"} onClick={() => handleDelete(pass.id, pass.numberPassenger)} className="btn btn-sm btn-danger">Supprimer</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success float-right">Enregistrer</button>
                </div>
            </form>
        </>
    )
}

export default CovoitPage;