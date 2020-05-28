import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import CovoitAPI from "../services/CovoitAPI";
import {toast} from "react-toastify";
import axios from "axios";
import {API_URL, CARS_API, PASSENGERS_API} from "../config";
import DateFunctions from "../services/DateFunctions";


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
            const datetime = DateFunctions.dateFormatYMDHMArr(response["date"]);
            response["date"] = datetime[0];
            response["time"] = datetime[1];
            if (response["userId"].address['@id'] == response["departureAddress"]["@id"]){
                response["fromHome"] = true
            } else {
                response["fromHome"] = false;
            }
            response["street"] = response["departureAddress"]["street"];
            response["code"] = response["departureAddress"]["code"];
            response["number"] = response["departureAddress"]["number"];
            response["city"] = response["departureAddress"]["city"];
            response["user"] = response["userId"]["id"];
            setCar(response);
            setCarPass(response.carPassengers);
        } catch (error) {
            console.log(error.response);
        }
    };



    const handleChangeCar = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        if (name == "fromHome"){
            const homeVal = !car.fromHome
            setCar({...car, [name]: homeVal});
        } else {
            setCar({...car, [name]: value});
        }
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
            const response = await CovoitAPI.create(copyCar);
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
        for (let i = 0; i < currentCar["carPassengers"].length; i++){
            currentCar["carPassengers"][i] = currentCar["carPassengers"][i]["@id"];
        }
        let currentCarPass = carPass[id];
        currentCar["placeRemaining"] -= currentCarPass["numberPassenger"];
        currentCar["userId"] = currentCar["userId"]["@id"];
        currentCarPass["user"] = currentCarPass["user"]["@id"];
        currentCarPass["isAccepted"] = true;
        return;
        try {
            axios.all([
                axios.put(API_URL + currentCarPass["@id"], currentCarPass),
                axios.put(CARS_API + "/"+ currentCar.id, currentCar),
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
            if (currentCar["carPassengers"][i]== id){
                console.log(currentCar["carPassengers"][i]);
            }
        }
        return;
        currentCar["placeRemaining"] += numberPassenger;
        currentCar["userId"] = currentCar["userId"]["@id"];
        try {
            axios.all([
                axios.put(CARS_API + "/" + currentCar.id, currentCar),
                axios.delete(API_URL + id),
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
                <div className="row">
                    <div className={"col-6"}>
                        <div className="row">
                            <div className="col-8">
                                <Field name={"title"} label={"Titre"} type={"text"} value={car.title} onChange={handleChangeCar} />
                            </div>
                            <div className="col-4">
                                <Field name={"placeRemaining"} label={"Places disponibles"} type={"number"} min={1} onChange={handleChangeCar} error={errors.placeRemaining} value={car.placeRemaining || ""}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Field name={"date"} label={"Jour"} type={"date"} value={car.date} onChange={handleChangeCar} />
                            </div>
                            <div className="col">
                                <Field name={"time"} label={"Heure de départ"} type={"time"} value={car.time} onChange={handleChangeCar} />
                            </div>
                        </div>
                    </div>
                    <div className={"col-6"}>
                        <div className={"custom-control custom-checkbox mb-3"}>
                            <input type="checkbox" className="custom-control-input" name={"fromHome"} id={"home"} checked={car.fromHome} onChange={handleChangeCar}/>
                            <label className="custom-control-label" htmlFor={"home"}>Départ de mon domicile</label>
                        </div>
                        {!car.fromHome &&
                        <>
                            <div className="row">
                                <div className="col-9">
                                    <Field name={"street"} label={"Rue"} type={"text"} value={car.street} onChange={handleChangeCar} error={errors.street}/>
                                </div>
                                <div className="col-3">
                                    <Field name={"number"} label={"Numéro"} type={"number"} value={car.number} onChange={handleChangeCar} error={errors.number}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-7">
                                    <Field name={"city"} label={"Ville"} type={"text"} value={car.city} onChange={handleChangeCar}/>
                                </div>
                                <div className="col-5">
                                    <Field name={"code"} label={"Code postal"} type={"number"} min={1000} max={9999} value={car.code} onChange={handleChangeCar} />
                                </div>
                            </div>
                        </>
                        }
                    </div>
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
                            <tr key={index}>
                                <td>{pass.isAccepted == false && <i className="far fa-clock"></i> || <i className="fas fa-check"></i>}</td>
                                <td>{pass["user"]["firstName"] +" "+ pass["user"]["lastName"]}</td>
                                <td>{pass["comment"]}</td>
                                <td>{pass["numberPassenger"]}</td>
                                <td><input className={"form-control"} value={pass["answer"]} onChange={handleChangePass} id={index} name={"answer"} type={"text"} placeholder={"Ajouter une précision, Ex: heure"} /></td>
                                <td>
                                    {pass.isAccepted == false && <button type={"button"} onClick={accept} id={index} className="btn btn-sm btn-success mr-3">Accepter</button>}
                                    <button type={"button"} onClick={() => handleDelete(pass["@id"], pass.numberPassenger)} className="btn btn-sm btn-danger">Supprimer</button>
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