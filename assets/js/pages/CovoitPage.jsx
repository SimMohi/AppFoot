import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import DateTimePicker from 'react-datetime-picker'
import CovoitAPI from "../services/CovoitAPI";
import {toast} from "react-toastify";


const CovoitPage = props => {

    const id = props.id;
    const userId = props.user["@id"];

    const [editing, setEditing] = useState(false);

    const [car, setCar] = useState({
        departurePlace: "",
        date: new Date(),
        placeRemaining: "",
        userId: userId,
        carPassengers: []
    });

    const [errors, setErrors] = useState({
        departurePlace: "",
        date: "",
        placeRemaining: "",
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
                toast.success("Le covoiturage a bien été modifié");
            } else {
                const response = await CovoitAPI.create(car);
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
            <h3>Choissisez une heure</h3>
            <DateTimePicker
                onChange={onChangeHour}
                value={car.date}
            />
            <form onSubmit={handleSubmit}>
                <Field name={"departurePlace"} label={"Lieu de départ"} type={"text"} onChange={handleChangeCar} error={errors.departurePlace} value={car.departurePlace}/>
                <Field name={"placeRemaining"} label={"Nombre de places disponibles"} type={"number"} min={1} onChange={handleChangeCar} error={errors.placeRemaining} value={car.placeRemaining}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success float-right">Enregistrer</button>
                </div>
            </form>
        </>
    )
}



export default CovoitPage;