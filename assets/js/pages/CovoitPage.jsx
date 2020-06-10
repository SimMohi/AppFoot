import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import DateTimePicker from 'react-datetime-picker'
import CovoitAPI from "../services/CovoitAPI";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import DateFunctions from "../services/DateFunctions";


const CovoitPage = props => {

    const id = props.id;
    const userId = props.user.id;
    const [editing, setEditing] = useState(false);

    const [car, setCar] = useState({
        title: "",
        fromHome: true,
        date: DateFunctions.todayFormatYMD(),
        time: "19:00",
        placeRemaining: 1,
        userId: userId,
        carPassengers: [],
        street: '',
        city: "",
        number: "",
        code : "",
    });

    const [errors, setErrors] = useState({
        title: "",
        date: "",
        placeRemaining: "",
        street: "",
        city: "",
        number: "",
        code: ""
    });

    const fetchCar = async id => {
        try {
            const { departurePlace, date, placeRemaining, userId, carPassengers} = await CovoitAPI.find(id);
            let userIdIris = userId["@id"];
            setCar({ departurePlace, date, placeRemaining, userIdIris, carPassengers});
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


    const handleSubmit = async (event) => {
        event.preventDefault();
        let copy = JSON.parse(JSON.stringify(car));
        copy["date"] = new Date(car.date + " " + car.time);
        delete copy.time;
        try {
            if(editing){
                const response = await CovoitAPI.update(id, car);
                toast.success("Le covoiturage a bien été modifié");
            } else {
                const response = await CovoitAPI.create(copy);
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
                window.location.reload();
                toast.success("Le covoiturage a bien été créé");
            }
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


    useEffect(() => {
        if (id !== "new") {
            fetchCar(id);
            setEditing(true);
        }
    }, [id]);

    return(
        <>
            <form onSubmit={handleSubmit} className={""}>
                <Field name={"title"} label={"Titre"} type={"text"} value={car.title} onChange={handleChangeCar} error={errors.title}/>
                <Field name={"date"} label={"Jour"} type={"date"} value={car.date} onChange={handleChangeCar} />
                <Field name={"time"} label={"Heure de départ"} type={"time"} value={car.time} onChange={handleChangeCar} />
                <div className={"custom-control custom-checkbox mb-3"}>
                    <input type="checkbox" className="custom-control-input" name={"fromHome"} id={"home"} checked={car.fromHome} onChange={handleChangeCar}/>
                    <label className="custom-control-label" htmlFor={"home"}>Départ de mon domcicile</label>
                </div>
                {!car.fromHome &&
                    <>
                        <div className="row">
                            <div className="col-7">
                                <Field name={"street"} label={"Rue"} type={"text"} value={car.street} onChange={handleChangeCar}/>
                            </div>
                            <div className="col-5">
                                <Field name={"city"} label={"Ville"} type={"text"} value={car.city} onChange={handleChangeCar}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <Field name={"number"} label={"Numéro"} type={"number"} value={car.number} onChange={handleChangeCar} error={errors.number}/>
                            </div>
                            <div className="col-6">
                                <Field name={"code"} label={"Code postal"} type={"number"} min={1000} max={9999} value={car.code} onChange={handleChangeCar} />
                            </div>
                        </div>
                    </>
                }
                <Field name={"placeRemaining"} label={"Nombre de places disponibles"} type={"number"} min={1} onChange={handleChangeCar} error={errors.placeRemaining} value={car.placeRemaining}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-warning float-right">Enregistrer</button>
                </div>
            </form>
        </>
    )
}



export default CovoitPage;