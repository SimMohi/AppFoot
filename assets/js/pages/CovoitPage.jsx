import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import DateTimePicker from 'react-datetime-picker'
import CovoitAPI from "../services/CovoitAPI";

const CovoitPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [car, setCar] = useState({
        departurePlace: "",
        date: new Date(),
        placeRemaining: "",
        userId: "/api/users/1"
    });

    const [errors, setErrors] = useState({
        departurePlace: "",
        date: "",
        placeRemaining: "",
    });

    const onChangeHour = date => setCar({...car, ["date"]: date });

    const handleChangeCar = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCar({...car, [name]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing){
                const response = await CovoitAPI.update(id, car);
            } else {
                const response = await CovoitAPI.create(car);
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
            setEditing(true);
        }
    }, [id]);

    console.log(car);
    return(
        <>
            <h3>Choissisez une heure</h3>
            <DateTimePicker
                onChange={onChangeHour}
                value={car.date}
            />
            <form onSubmit={handleSubmit}>
                <Field name={"departurePlace"} label={"Lieu de départ"} type={"text"} onChange={handleChangeCar} error={errors.departurePlace} value={car.departurePlace}/>
                <Field name={"placeRemaining"} label={"Nombre de places disponibles"} type={"number"} min={1} onChange={handleChangeCar} error={errors.placeRemaining} value={car.placeRemaining}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/covoit"} className={"btn btn-link"}>Retour à la page des covoiturages</Link>
                </div>
            </form>
        </>
    )
}

export default CovoitPage;