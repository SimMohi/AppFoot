import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Fields";
import DateFunctions from "../services/DateFunctions";
import jwtDecode from "jwt-decode";
import CovoitAPI from "../services/CovoitAPI";
import {toast} from "react-toastify";
import axios from "axios";
import {API_URL, CARS_API} from "../config";
import ChatAPI from "../services/ChatAPI";

const CovoitAccess = props => {
    const {id} = props.match.params;
    const [reload, setReload] = useState(0);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [car, setCar] = useState({});

    const [carPass, setCarPass] = useState([])
    const userId = getId();
    const [errors, setErrors] = useState({
        departurePlace: "",
        date: "",
        placeRemaining: "",
    });

    function getId () {
        const token = window.localStorage.getItem(("authToken"));
        if (token){
            const { id } = jwtDecode(token);
            return id;
        }
        return 0;
    }

    const handleChange = ({currentTarget}) => {
        setNewMessage(currentTarget.value);
    }

    const fetchCar = async id => {
        try {
            const response = await CovoitAPI.find(id);
            response["date"] = response["date"];
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
        copyCar["date"] = new Date(car.date + " " + car.time);
        delete  copyCar.userId;
        delete copyCar.departureAddress;
        delete copyCar.carPassengers;

        try {
            const response = await CovoitAPI.update(copyCar.id, copyCar);
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
        let newNotif = {
            user: currentCarPass["user"]["id"],
            car: currentCar["id"],
            accept: true
        }
        currentCar["placeRemaining"] -= currentCarPass["numberPassenger"];
        currentCar["userId"] = currentCar["userId"]["@id"];
        currentCar["departureAddress"] = currentCar["departureAddress"]["@id"];
        currentCarPass["user"] = currentCarPass["user"]["@id"];
        currentCarPass["isAccepted"] = true;
        delete currentCar.date;
        try {
            axios.all([
                axios.put(API_URL + currentCarPass["@id"], currentCarPass),
                axios.put(CARS_API + "/"+ currentCar.id, currentCar),
                axios.post(API_URL + "/newNotifCarPassAR", newNotif)
            ]);
            toast.success("La demande a bien été acceptée");
        } catch (error) {
            toast.error("L'acceptation de la demande a échoué");
        }
        setReload(reload+1);
        setCarPass([]);
    }

    const handleDelete =  (id, numberPassenger) => {
        let currentCar = JSON.parse(JSON.stringify(car));
        for (let i = 0; i < currentCar["carPassengers"].length; i++){
            currentCar["carPassengers"][i] = currentCar["carPassengers"][i]["@id"];
            if (currentCar["carPassengers"][i]== id){
            }
        }
        currentCar["departureAddress"] = currentCar["departureAddress"]["@id"];
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

    const getMessage = async (id) => {
        const newMessages = await ChatAPI.getChatCovoit(id);
        const objDiv = document.getElementById("message-list");
        objDiv.scrollTop = objDiv.scrollHeight;
        console.log(objDiv);
        setMessages(newMessages);
    }

    const handleSubmitMess = async (event) => {
        event.preventDefault();
        let post = {
            message: newMessage,
            userId: userId,
            carId : id
        }
        try{
            await ChatAPI.sendMessageCovoit(post);
        } catch (e) {
            toast.error("Echec lors de l'envoi du message");
        }
        setReload(reload+1);
        setNewMessage("");
    }

    const unSub = async () => {
        const post = {
            user: userId,
            car: id
        }
        await CovoitAPI.unSub(post);
        props.history.replace("/covoit");

    }

    useEffect(() => {
        fetchCar(id);
        getMessage(id);
    }, [id, reload]);

    return(
        <>
            <div className="d-flex justify-content-between">
                <Link to={"/covoit"} className={"btn btn-danger mr-3 mb-5"}><i className="fas fa-arrow-left"/></Link>
                <div>
                    <button className="btn btn-danger btn-lg mr-5" onClick={unSub}>
                        Se désinscrire
                    </button>
                </div>

            </div>
            <h2 className={"text-center mb-5"}>Covoiturage: {car.title}</h2>
            <div className="row justify-content-center">
                <div className="col-6  p-3 mr-5 mb-5">
                    <div className={"d-flex justify-content-between whiteBorder m-5 p-3"}>
                        <div className={"mr-3"}>
                            <h5>Places restantes:</h5>
                            <h5>Date:</h5>
                            <h5>Départ:</h5>
                        </div>
                        <div>
                            <h5> {car.placeRemaining}</h5>
                            <h5> {DateFunctions.dateFormatFrDMHM(car.date)}</h5>
                            <h5> {car.street+ " "+ car.number+ ", " + car.code + " " + car.city}</h5>
                        </div>

                    </div>
                    <div className="whiteBorder p-3 m-5">
                        <h3 className={"text-center mb-5"}>Passagers acceptés</h3>
                        <table className="table table-hover text-center pl-3 container">
                            <thead>
                            <tr className={"row"}>
                                <th className={"col-6"}>Passager</th>
                                <th className={"col-4"}>Places</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {carPass.map((pass, index) =>
                                pass.isAccepted &&
                                <tr key={index} className={'row'}>
                                    <td className={"col-6"}>{pass["user"]["firstName"] +" "+ pass["user"]["lastName"]}</td>
                                    <td className={"col-4"}>{pass["numberPassenger"]}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"col-4 ml-5"} id="rootCov">
                    <div className="appCov whiteBorder">
                        <div className="message-list p-3" id={"message-list"}>
                            {messages.map((message, index) => {
                                if (message["senderId"] == userId){
                                    return(
                                        <div key={index} className="message d-flex flex-row-reverse">
                                            <div>
                                                <div className="message-username text-right mr-3" >{DateFunctions.dateFormatFrDMHM(message.date)}</div>
                                                <div className="message-text myMessage mr-3">{message.text}</div>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return(
                                        <div key={index} className="message">
                                            <div className="message-username" >{message.sender} {DateFunctions.dateFormatFrDMHM(message.date)}</div>
                                            <div className="message-text">{message.text}</div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        <form
                            onSubmit={handleSubmitMess}
                            className="send-message-form">
                            <input
                                onChange={handleChange}
                                value={newMessage}
                                placeholder="Ecrivez votre message"
                                type="text" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CovoitAccess;