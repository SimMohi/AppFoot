import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import ReactSearchBox from 'react-search-box'
import usersAPI from "../services/usersAPI";
import UsersTeamAPI from "../services/UsersTeamAPI";
import TrainingsAPI from "../services/TrainingsAPI";
import Moment from "react-moment";


const RonvauTeamPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [compet, setCompet] = useState([]);
    const [trainingDay, setTrainingDay] = useState([]);
    const [reload, setReload] = useState(0);
    const [selectUser, setSelectUser] = useState({
        role: 0,
    });
    const [selectCompet, setSelectCompet] = useState("");
    const [selectTraining, setSelectTraining] = useState({
       day: "Lundi",
       hourStart: "20:00",
       hourEnd: "21:30",
    });
    const [ronvauTeam, setRonvauTeam] = useState({
        id: "",
        category: "",
        coach: "",
        userTeams: [],
        competition: ""
    });
    const [errors, setErrors] = useState({
        category: "",
        coach: "",
        select: ""
    });

    const fetchCompetition = async () => {
        try {
            const competitions = await RonvauTeamAPI.findCompetRonvau();
            let newArray = [];
            for (let i = 0; i < competitions.length; i++){
                newArray.push({
                    "key": competitions[i].id,
                    "value": competitions[i].name
                });
            }
            setCompet(newArray);
        } catch (error) {
            console.log(error.response);
        }
    };

    const fetchTrainingDay = async () => {
        try{
            const allTrainingDay = await TrainingsAPI.findAllTrainingDay(id);
            setTrainingDay(allTrainingDay);
        }catch (e) {
            console.log(e.response);
        }
    }

    const fetchRonvauTeam = async idRT => {
        try {
            const { id, category, coach, userTeams, competition} = await RonvauTeamAPI.find(idRT);
            setRonvauTeam({ id, category, coach, userTeams, competition});
            if (typeof competition == 'undefined'){
                await fetchCompetition();
            }
        } catch (error) {
            console.log(error.response);
        }
    };

    const fetchUsers = async () =>{
        try{
            const allUsers = await usersAPI.findAll();
            let newArray = [];
            for (let i = 0; i < allUsers.length; i++){
                newArray.push({
                    "key": allUsers[i].id,
                    "value": allUsers[i].lastName+ " " + allUsers[i].firstName,
                });
            }
            setUsers(newArray);
        } catch (error) {
            console.log(error.response);
        }
    }


    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setRonvauTeam({...ronvauTeam, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let copyRonvauTeam = JSON.parse(JSON.stringify(ronvauTeam));
        for(let i = 0; i < copyRonvauTeam["userTeams"].length; i++){
            copyRonvauTeam["userTeams"][i] = copyRonvauTeam["userTeams"][i]["@id"];
        }
        try {
            if (editing){
                await RonvauTeamAPI.update(id, copyRonvauTeam);
                toast.success("L'équipe a bien été modifiée");
                props.history.replace("/equipeRonvau");
            } else {
                await RonvauTeamAPI.create(copyRonvauTeam);
                toast.success("L'équipe a bien été créée");
                props.history.replace("/equipeRonvau");
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
    };

    const AddUserTeam = async () =>{
        if (typeof selectUser["id"] == 'undefined'){
            toast.error("Renseigner un utilisateur");
            return;
        }
        let newUserTeam = {
            userId: "/api/users/"+selectUser["id"],
            teamRonvauId: "/api/team_ronvaus/"+id,
        };
        if (selectUser.role == 0){
            newUserTeam["isPlayer"] = true;
            newUserTeam["isStaff"] = false;
        } else if(selectUser.role == 1){
            newUserTeam["isPlayer"] = false;
            newUserTeam["isStaff"] = true;
        } else if (selectUser.role == 2){
            newUserTeam["isPlayer"] = true;
            newUserTeam["isStaff"] = true;
        }
        try{
            await UsersTeamAPI.create(newUserTeam);
            toast.success("L' utilisateur a bien été ajouté à l'équipe");
        } catch (e) {
            toast.error("Erreur lors de l'ajout d'un utilisateur à une équipe");
        }
        setReload(reload+1);
    }

    const handleChangeSelect = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectUser({...selectUser, [name] : value});
    }

    const handleChangeSelectTraining = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectTraining({...selectTraining, [name] : value});
    }

    const AddCompetTeam = async () => {
        if (typeof selectCompet == 'undefined' || selectCompet == ""){
            toast.error("Renseigner une compétition");
            return;
        }
        let copyRonvauTeam = JSON.parse(JSON.stringify(ronvauTeam));
        for(let i = 0; i < copyRonvauTeam["userTeams"].length; i++){
            copyRonvauTeam["userTeams"][i] = copyRonvauTeam["userTeams"][i]["@id"];
        }
        copyRonvauTeam["competition"] = "/api/competitions/"+selectCompet;
        try{
            await RonvauTeamAPI.update(copyRonvauTeam.id, copyRonvauTeam);
            toast.success("L'équipe a bien été liée à la comptétition");
        } catch (e) {
            toast.error("L'équipe n'a pas été liée à la compétition");
        }
        setReload(reload+1);
    }

    const handleDelete = async (idUserTeam) => {
        try{
            await UsersTeamAPI.deleteUserTeam(idUserTeam);
            toast.success("la suppression de l'utilisateur de l'équipe a réussi");
        }catch (e) {
            toast.error("la suppression de l'utilisateur a échoué");
        }
        setReload(reload+1);
    }

    const handleDeleteCompet = async () => {
        let copyRonvauTeam = JSON.parse(JSON.stringify(ronvauTeam));
        for(let i = 0; i < copyRonvauTeam["userTeams"].length; i++){
            copyRonvauTeam["userTeams"][i] = copyRonvauTeam["userTeams"][i]["@id"];
        }
        copyRonvauTeam["competition"] = null;
        toast.success("l'équipe a bien été retirée de la compétition");
        try {
            await RonvauTeamAPI.update(copyRonvauTeam.id, copyRonvauTeam);
        } catch (e) {
            toast.error("l'équipe n'a pas été retirée de la compétition");
        }
        setReload(reload+1);
    }

    const submitTraining = async () => {
        let copySelectTraining = JSON.parse(JSON.stringify(selectTraining));
        let start = copySelectTraining["hourStart"].replace(":", "");
        let end = copySelectTraining["hourEnd"].replace(":", "");
        if (start >= end){
            toast.error("L'heure de fin doit être supérieur à l'heure de début");
            return ;
        }
        copySelectTraining["teamRonvau"] = "/api/team_ronvaus/"+id;
        try{
            await TrainingsAPI.createTrainingDay(copySelectTraining);
            toast.success("L'entraînement a été ajouté avec succès");
        }catch (e) {
            toast.error("L'entraînement n'a pas été ajouté");
        }
        setReload(reload+1);
    }

    const handleDeleteTrainingDay = async (id) => {
        try {
            await TrainingsAPI.deleteTrainingDay(id);
            toast.success("L'entraînement a bien été supprimé");
        } catch (e) {
            toast.error("L'entraînement n'a pas été supprimé");
        }
        setReload(reload+1);
    }
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchRonvauTeam(id);
            fetchUsers();
            fetchTrainingDay();
        }
    }, [id, reload]);

    return  (
        <>
            {!editing && <h1>Création d'une nouvelle équipe</h1> || <h1>Modification d'une équipe</h1>}
            <div className={"container"}>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-8">
                            <Field name={"category"} label={"Catégorie de l'équipe"} type={"text"} value={ronvauTeam.category} onChange={handleChange} error={errors.category}/>
                            <Field name={"coach"} label={"Coach de l'équipe"} type={"text"} value={ronvauTeam.coach} onChange={handleChange} error={errors.coach}/>
                            {editing &&
                                <>
                                    <table className="mt-5 table table-hover text-center">
                                        <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>joueur</th>
                                            <th>Staff</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ronvauTeam["userTeams"].map(userTeam =>
                                            <tr key={userTeam.id}>
                                                <td>{userTeam.userId.lastName+" "+userTeam.userId.firstName}</td>
                                                <td>{userTeam.isPlayer && <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}</td>
                                                <td>{userTeam.isStaff && <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}</td>
                                                <td>
                                                    <button type={"button"} onClick={() => handleDelete(userTeam.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                    <h5 className={"mt-5"}>Programmation des entraînements</h5>
                                    <div className={"m-4 container"}>
                                        <table className="mt-5 table table-hover text-center">
                                            <thead className={"container"}>
                                                <tr className={"row"}>
                                                    <th className={"col-3"}>Jour</th>
                                                    <th className={"col-3"}>heure de début</th>
                                                    <th className={"col-3"}>heure de fin</th>
                                                    <th className={"col-3"}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {trainingDay.map(td =>
                                                <tr className={"row"} key={td.id}>
                                                    <td className={"col-3"}>
                                                        {td.day}
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <Moment format="HH:mm">
                                                            {td.hourStart}
                                                        </Moment>
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <Moment format="HH:mm">
                                                            {td.hourEnd}
                                                        </Moment>
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <button type={"button"} onClick={() => handleDeleteTrainingDay(td.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                                    </td>
                                                </tr>
                                            )}
                                                <tr className="row">
                                                    <td className={"col-3"}>
                                                        <select className="form-control" name={"day"} value={selectTraining["day"]}
                                                                onChange={handleChangeSelectTraining}>
                                                            <option value={"Lundi"}>Lundi</option>
                                                            <option value={"Mardi"}>Mardi</option>
                                                            <option value={"Mercredi"}>Mercredi</option>
                                                            <option value={"Jeudi"}>Jeudi</option>
                                                            <option value={"Vendredi"}>Vendredi</option>
                                                            <option value={"Samedi"}>Samedi</option>
                                                            <option value={"Dimanche"}>Dimanche</option>
                                                        </select>
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <input type="time" name={"hourStart"} className={"form-control"} step={300}
                                                               value={selectTraining["hourStart"]} onChange={handleChangeSelectTraining}/>
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <input type="time"name={"hourEnd"} className={"form-control"} step={300}
                                                               value={selectTraining["hourEnd"]} onChange={handleChangeSelectTraining}/>
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <button type={"button"} onClick={submitTraining} className="btn btn-sm btn-success">Ajouter un entraînement</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="col-4">
                            <div className="col">
                                {editing &&
                                <>
                                    {typeof ronvauTeam["competition"] == 'undefined' &&
                                        <>
                                            <div className="mt-3 p-0">
                                                <ReactSearchBox
                                                    placeholder="Ajouter l'équipe à une compétition"
                                                    data={compet}
                                                    onSelect={record => setSelectCompet(record["key"])}
                                                    onFocus={() => {
                                                    }}
                                                    onChange={() => {
                                                    }}
                                                    fuseConfigs={{
                                                        threshold: 0.05,
                                                    }}
                                                />
                                            </div>
                                            <div className={"mt-3 mb-5"}>
                                                <button type={"button"} onClick={() => AddCompetTeam()}
                                                        className="btn btn-primary ml-auto d-block">Ajouter
                                                </button>
                                            </div>
                                        </>
                                    ||
                                        <>
                                            <h5>L'équipe est liée à la compétition: </h5>
                                            <h5>
                                                {ronvauTeam["competition"]["name"]}
                                                <button type={"button"} onClick={handleDeleteCompet} className="btn btn-sm btn-danger float-right">Supprimer</button>
                                            </h5>
                                        </>
                                    }
                                    <div className="mt-3 p-0">
                                        <ReactSearchBox
                                            placeholder="Ajouter un utilisateur à l'équipe"
                                            data={users}
                                            onSelect={record => setSelectUser({...selectUser, ["id"]: record["key"]})}
                                            onFocus={() => {
                                            }}
                                            onChange={() => {}}
                                            fuseConfigs={{
                                                threshold: 0.05,
                                            }}
                                        />
                                    </div>
                                    <select className="form-control mt-3" name={"role"} value={selectUser["role"]}
                                            onChange={handleChangeSelect}>
                                        <option value={0}>Joueur</option>
                                        <option value={1}>Coach</option>
                                        <option value={2}>Coach - Joueur</option>
                                    </select>
                                    <div className={"mt-3 mb-5"}>
                                        <button type={"button"} onClick={() => AddUserTeam()}
                                                className="btn btn-primary ml-auto d-block">Ajouter
                                        </button>
                                    </div>
                                </>
                                }
                                <div className="from-group mt-5">
                                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                                    <Link to={"/equipeRonvau"} className={"btn btn-link"}>Retour à la liste</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RonvauTeamPage;