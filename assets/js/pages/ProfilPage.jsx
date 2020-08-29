import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Field from "../components/forms/Fields";
import ReactSearchBox from "react-search-box";
import {USERS_API} from "../config";
import Modal from "react-bootstrap/Modal";
import {Link} from "react-router-dom";
import authAPI from "../services/authAPI";

const ProfilPage = props => {

    const [newPass, setNewPass] = useState({
        current: "",
        new: "",
        confirm: "",
    })
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [reload, setReload] = useState(0);
    const [user, setUser] = useState({
        id: "",
        lastName: "",
        firstName: "",
        email: "",
        gsm: "",
        address: {},
        profilePic: null
    });

    const [imageSelect, setImageSelect] = useState(null);

    const [address, setAddress] = useState({
        city: "",
        code: "",
        street: "",
        box: "",
        number : "",
    })

    const [info, setInfo] = useState([]);
    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        gsm: "",
        city: "",
        code: "",
        street: "",
        box: "",
        number : "",
        imageSize: "",
        imageFormat: "",
        confirm: "",
        current: "",
    });
    const [allUsers, setAllUSers] = useState([]);

    const changePass = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setNewPass({ ...newPass, [name]: value });
    };


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
                        const { id, lastName, firstName, email, gsm, address, profilePic} = usersResponse[i];
                        if (typeof address !== 'undefined'){
                            setAddress(address);
                        }
                        setUser({ id, lastName, firstName, email, gsm, profilePic});
                        const response = await usersAPI.profile(id);
                        setInfo(response["data"]["infos"]);
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

    const handleChangeAdd = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setAddress({...address, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user.gsm/0 != 'Infinity' && typeof user.gsm != "undefined"){
            let error = {};
            error["gsm"] = "Numéro de gsm non-valide";
            setErrors(error);
            return ;
        }
        let copyAdd = JSON.parse(JSON.stringify(address));
        let copyUser = JSON.parse(JSON.stringify(user));
        delete copyUser.address;
        copyAdd["userId"] = user.id;
        try {
            await usersAPI.update(user.id, copyUser);
            await usersAPI.postProfile(copyAdd);
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

    const imageUpload = async () => {
        if (errors.imageFormat || errors.imageSize) {
            return ;
        }
        const fd = new FormData();
        fd.append('id', user.id);
        fd.append('image', imageSelect);
        fd.append('name', imageSelect.name);
        const response = await usersAPI.uploadImage(fd);
        setShow(false);
        setReload(reload+1);
    }

    const imageSelected = event => {
        let image = event.target.files[0];
        setImageSelect(image);
        const err = {};
        if(image.type != "image/png" && image.type != "image/jpg" && image.type != "image/jpeg") {
            err.imageFormat = true;
        } else {
            err.imageFormat = false;
        }
        if (image.size > 2000000){
            err.imageSize = true;
        } else {
            err.imageSize = false;
        }
        setErrors(err);
    }


    const goToProfile = (id) => {
        props.history.replace("/profil/" + id);
    }

    const modifPass = async () => {
        if (newPass.new != newPass.confirm){
            let error = {};
            error["confirm"] = "Les mots de passes ne correspondent pas";
            setErrors(error);
            return ;
        }
        const post = {
            id: authAPI.getId(),
            current: newPass.current,
            new: newPass.new,
        }
        const response = await usersAPI.changePass(post);
        if (response.data == "erreur"){
            let error = {};
            error["current"] = "Votre mot de passe actuel n'est pas correct";
            setErrors(error);
        } else {
            setShow2(false);
            toast.success("Mot de passe modifié avec succès");
        }
    }

    useEffect( () => {
        getUserConnected();
    }, [reload]);

    return(
        <>
            <div className="justify-content-center d-flex">
                <div className="m-2">
                    <div className="col">
                        <div className={"row"}>
                            <img className="rounded-circle profilePhoto account-img" src={user.profilePic}/>
                        </div>
                        <div className={"row"}>
                            <button className={"btn"} onClick={()=> setShow(true)}>
                                <i className=" modif far fa-edit"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="m-4 pt-5">
                    <h1 className={"text-center"}>Mon Profil</h1>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <form onSubmit={handleSubmit} className={"container mt-5 p-3 whiteBorder"}>
                            <div className="row">
                                <div className="col-6">
                                    <Field name={"lastName"} label={"Nom de famille"} type={"text"} value={user.lastName} onChange={handleChange} error={errors.lastName}/>
                                </div>
                                <div className="col-6">
                                    <Field name={"firstName"} label={"Prénom"} type={"text"} value={user.firstName} onChange={handleChange} error={errors.firstName}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Field name={"email"} label={"Email"} type={"email"} value={user.email} onChange={handleChange} error={errors.email}/>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor={"gsm"}>Gsm</label>
                                        <input placeholder={"Ajoutez un numéro de gsm. Format: 04XXXXXXXX"} className={"form-control " + (errors.gsm &&  "is-invalid")} type="tel" id="gsm" name="gsm"
                                               value={user.gsm || ""} onChange={handleChange}/>
                                        { errors.gsm && <p className={"invalid-feedback"}>{errors.gsm}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <Field name={"street"} label={"Rue"} type={"text"} value={address.street} onChange={handleChangeAdd} error={errors.street}/>
                                </div>
                                <div className="col-4">
                                    <Field name={"city"} label={"Ville"} type={"text"} value={address.city} onChange={handleChangeAdd} error={errors.city}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <Field name={"number"} label={"Numéro"} type={"number"} value={address.number} onChange={handleChangeAdd} error={errors.number}/>
                                </div>
                                <div className="col-4">
                                    <Field name={"box"} label={"Boîte"} type={"text"} value={address.box} onChange={handleChangeAdd} error={errors.box}/>
                                </div>
                                <div className="col-4">
                                    <Field name={"code"} label={"Code postal"} type={"text"} value={address.code} onChange={handleChangeAdd} error={errors.code}/>
                                </div>
                            </div>
                            <div className="from-group">
                                <button type={"submit"} className="btn btn-danger ml-auto">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={"d-flex justify-content-end"}>
                    <Link to={"/param"} className={"btn btn-warning mr-3 mb-5 mt-3"}>Paramètres de mon profil</Link>
                    <div>
                        <button onClick={()=>setShow2(true)} className="btn btn-danger mt-3 ml-5">
                            Modifier mon mot de passe
                        </button>
                    </div>
                </div>
            </div>
            <h5 className={"mt-5 text-center"}>Vos statistiques</h5>
            <table className="table table-hover mt-5 text-center container whiteBorder">
                <thead>
                <tr className={"row ml-3 mr-3"}>
                    <th className={"col-2"}>Equipe</th>
                    <th className={"col-2"}>Matchs joués</th>
                    <th className={"col-2"}><img src="img/Ball.png" alt="goal" className={"imgEncode"}/></th>
                    <th className={"col-2"}><img src="img/Carton_jaune.png" alt="jaune" className={"imgEncode"}/></th>
                    <th className={"col-2"}><img src="img/Carton_rouge.png" alt="rouge" className={"imgEncode"}/></th>
                    <th className={"col-2"}>Entrainements</th>
                </tr>
                </thead>
                <tbody>
                {info.map((team, index) =>
                    <tr key={index} className={"row ml-3 mr-3"}>
                        <td className={"col-2"}>{team.team}</td>
                        <td className={"col-2"}>{team.played}</td>
                        <td className={"col-2"}>{team.goal}</td>
                        <td className={"col-2"}>{team.yellowCard}</td>
                        <td className={"col-2"}>{team.redCard}</td>
                        <td className={"col-2"}>{team.training}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Modifier votre photo de profil
                </Modal.Header>
                <Modal.Body className={""}>
                    <div>
                        <input type="file"  onChange={imageSelected}/>
                        <ul className={"mt-3"}>
                            {errors.imageFormat &&
                                <li className={"text-danger"}>La photo doit être sous format JPEG, JPG ou PNG</li>
                                ||
                                <li>La photo doit être sous format JPEG, JPG ou PNG</li>
                            }
                            {errors.imageSize &&
                            <li className={"text-danger"}>La photo doit faire moins de 2MO</li>
                                ||
                            <li>La photo doit faire moins de 2MO</li>
                            }
                        </ul>
                        <button type="button" className={"btn btn-danger"} onClick={imageUpload}>Enregistrer</button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={show2} onHide={() => setShow2(false)}>
                <Modal.Header closeButton>
                    Modifier mon mot de passe
                </Modal.Header>
                <Modal.Body className={""}>
                    <div>
                        <Field
                            name="current"
                            label="Mot de passe actuel"
                            placeholder="Votre mot de passe actuel"
                            type="password"
                            error={errors.current}
                            value={newPass.current}
                            onChange={changePass}
                        />
                        <Field
                            name="new"
                            label="Nouveau mot de passe"
                            placeholder="Votre nouveau mot de passe"
                            type="password"
                            value={newPass.new}
                            onChange={changePass}
                        />
                        <Field
                            name="confirm"
                            label="Confirmation du mot de passe"
                            type="password"
                            placeholder="Confirmer votre nouveau mot de passe"
                            value={newPass.confirm}
                            error={errors.confirm}
                            onChange={changePass}
                        />
                        Le mot de passe doit contenir :
                        <ul>
                            <li>Plus de 8 caractères</li>
                            <li>Une majuscule</li>
                            <li>Une minuscule</li>
                            <li>Un nombre</li>
                            <li>Un caractère spécial</li>
                        </ul>
                        <button type="button" className={"btn btn-danger"} onClick={modifPass}>Modifier</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ProfilPage;