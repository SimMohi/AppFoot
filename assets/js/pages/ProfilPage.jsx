import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Field from "../components/forms/Fields";
import ReactSearchBox from "react-search-box";
import {USERS_API} from "../config";

const ProfilPage = props => {

    const [user, setUser] = useState({
        id: "",
        lastName: "",
        firstName: "",
        email: "",
        gsm: ""
    });
    const [info, setInfo] = useState([]);
    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        gsm: ""
    });
    const [allUsers, setAllUSers] = useState([]);

    const getUserConnected =  async () => {
        const token = window.localStorage.getItem(("authToken"));
        if (token) {
            const {username: user} = jwtDecode(token);
            axios.all([
                axios.get(USERS_API +"?email=" + user),
                axios.get(USERS_API)
            ]).then(axios.spread(async (...responses) => {
                const usersResponse = responses[1]["data"]["hydra:member"];
                let allUsersArray = [];
                for (let i = 0; i < usersResponse.length; i++){
                    if (usersResponse[i].email == user){
                        const { id, lastName, firstName, email, gsm} = usersResponse[i];
                        setUser({ id, lastName, firstName, email, gsm});
                        const response = await usersAPI.profile(id);
                        setInfo(response["data"]);
                    } else {
                        let user =  {
                            "key": usersResponse[i].id,
                            "value": usersResponse[i].firstName + " " + usersResponse[i].lastName,
                        }
                        allUsersArray.push(user);
                    }
                }
                setAllUSers(allUsersArray);

            })).catch(errors => {
                console.log(errors.response);
            })
        }
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({...user, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(user.gsm/0);
        let intGsm = parseInt(user.gsm);
        if (user.gsm/0 != 'Infinity'){
            let error = {};
            error["gsm"] = "Numéro de gsm non-valide";
            console.log(error);
            setErrors(error);
            return ;
        }
        try {
            await usersAPI.update(user.id, user);
            toast.success("Profil modifié avec Succès");
            setErrors({});
        }catch (error) {
            toast.error("La modifictation a échouée");
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

    const goToProfile = (id) => {
        props.history.replace("/profil/" + id);
    }

    useEffect( () => {
        getUserConnected();
    }, []);

    return(
        <>
            <h1 className={"text-center"}>Profil</h1>
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <form onSubmit={handleSubmit} className={"container mt-5"}>
                            <div className="row">
                                <div className="col-6">
                                    <Field name={"lastName"} label={"Nom de famille"} type={"text"} value={user.lastName} onChange={handleChange} error={errors.lastName}/>
                                </div>
                                <div className="col-6">
                                    <Field name={"firstName"} label={"Prénom"} type={"text"} value={user.firstName} onChange={handleChange} error={errors.firstName}/>
                                </div>
                            </div>
                            <Field name={"email"} label={"Email"} type={"text"} value={user.email} onChange={handleChange} error={errors.email}/>
                            <div className="form-group">
                                <input placeholder={"Ajoutez un numéro de gsm. Format: 04XXXXXXXX"} className={"form-control " + (errors.gsm &&  "is-invalid")} type="tel" id="gsm" name="gsm"
                                       value={user.gsm || ""} onChange={handleChange}/>
                                { errors.gsm && <p className={"invalid-feedback"}>{errors.gsm}</p>}
                            </div>
                            <div className="from-group">
                                <button type={"submit"} className="btn btn-success">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-4">
                        <ReactSearchBox
                            placeholder="Rechercher quelqu'un"
                            data={allUsers}
                            onSelect={record => goToProfile(record["key"])}
                            onFocus={() => {
                            }}
                            onChange={() => {
                            }}
                            fuseConfigs={{
                                threshold: 0.05,
                            }}
                        />
                    </div>
                </div>
            </div>
            <h5 className={"mt-5"}>Vos statistiques pour cette saison</h5>
            <table className="table table-hover mt-5 text-center container">
                <thead>
                <tr className={"row"}>
                    <th className={"col-4"}>Equipe</th>
                    <th className={"col-2"}>Matchs joués</th>
                    <th className={"col-2"}><img src="img/Ball.png" alt="goal" className={"imgEncode"}/></th>
                    <th className={"col-2"}><img src="img/Carton_jaune.png" alt="jaune" className={"imgEncode"}/></th>
                    <th className={"col-2"}><img src="img/Carton_rouge.png" alt="rouge" className={"imgEncode"}/></th>
                </tr>
                </thead>
                <tbody>
                {info.map((team, index) =>
                    <tr key={index} className={"row"}>
                        <td className={"col-4"}>{team.team}</td>
                        <td className={"col-2"}>{team.played}</td>
                        <td className={"col-2"}>{team.goal}</td>
                        <td className={"col-2"}>{team.yellowCard}</td>
                        <td className={"col-2"}>{team.redCard}</td>
                    </tr>
                )}
                </tbody>
            </table>

        </>
    );
}

export default ProfilPage;