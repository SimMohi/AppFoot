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
    const [selectCompet, setSelectCompet] = useState({});
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
        team: ""
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
                    "value": competitions[i].name,
                    "team": competitions[i].team
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
            const { id, category, coach, userTeams, team} = await RonvauTeamAPI.find(idRT);
            setRonvauTeam({ id, category, coach, userTeams, team});
            if (typeof team == 'undefined'){
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
                delete copyRonvauTeam["userTeams"];
                delete copyRonvauTeam["team"];
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
        if (Object.keys(selectCompet).length === 0 && selectCompet.constructor === Object){
            toast.error("Renseigner une compétition");
            return;
        }
        let copyRonvauTeam = JSON.parse(JSON.stringify(ronvauTeam));
        for(let i = 0; i < copyRonvauTeam["userTeams"].length; i++){
            copyRonvauTeam["userTeams"][i] = copyRonvauTeam["userTeams"][i]["@id"];
        }
        copyRonvauTeam["team"] = "/api/teams/"+selectCompet["team"];

        try{
            await RonvauTeamAPI.update(copyRonvauTeam.id, copyRonvauTeam);
            toast.success("L'équipe a bien été liée à la comptétition");
        } catch (e) {
            toast.error("L'équipe n'a pas été liée à la compétition");
        }
        setReload(reload+1);
    }

    const handleDeleteCompet = async () => {
        let copyRonvauTeam = JSON.parse(JSON.stringify(ronvauTeam));
        for(let i = 0; i < copyRonvauTeam["userTeams"].length; i++){
            copyRonvauTeam["userTeams"][i] = copyRonvauTeam["userTeams"][i]["@id"];
        }
        copyRonvauTeam["team"] = null;
        try {
            await RonvauTeamAPI.update(copyRonvauTeam.id, copyRonvauTeam);
            toast.success("l'équipe a bien été retirée de la compétition");
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
        copySelectTraining["teamRonvau"] = id;
        try{
            await TrainingsAPI.createTrainingDay(copySelectTraining);
            toast.success("L'entraînement a été ajouté avec succès");
        }catch (e) {
            toast.error("L'entraînement n'a pas été ajouté");
        }
        setReload(reload+1);
    }

    const handleDeleteTrainingDay = async (index) => {
        let delTD = trainingDay[index];
        let teamR = id;
        let post = {
            day: delTD.day,
            teamR: teamR
        }
        try {
            await TrainingsAPI.deleteTrainingDay(post);
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
            <Link to={"/equipeRonvau"} className={"btn btn-info mb-5"}>Retour à la liste</Link>
            <Link to={"/equipeRonvau/"+ id+"/userAdmin"} className={"btn btn-lg btn-primary mb-5 mr-3 float-right"}>Gestion des joueurs</Link>
            <div className="row">
                <div className="col-9">
                    {!editing && <h1 className={"mb-5"}>Création d'une nouvelle équipe</h1> || <h1 className={"mb-5"}>Modification d'une équipe</h1>}
                </div>
                <div className="col-3">

                </div>
            </div>
            <div className={""}>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-7">
                            <div className="row">
                                <div className="col-8">
                                    <Field name={"category"} label={"Catégorie de l'équipe"} type={"text"} value={ronvauTeam.category} onChange={handleChange} error={errors.category}/>
                                    <button type={"submit"} className="btn btn-success float-right">Enregistrer</button>
                                </div>
                                <div className="col-4">
                                    <div className="from-group mt-4">

                                    </div>
                                </div>
                            </div>
                            {editing &&
                                <>
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
                                            {trainingDay.map((td, index) =>
                                                <tr className={"row"} key={index}>
                                                    <td className={"col-3"}>
                                                        {td.day}
                                                    </td>
                                                    <td className={"col-3"}>
                                                        {td.start}
                                                    </td>
                                                    <td className={"col-3"}>
                                                        {td.end}
                                                    </td>
                                                    <td className={"col-3"}>
                                                        <button type={"button"} onClick={() => handleDeleteTrainingDay(index)} className="btn btn-sm btn-danger">Supprimer</button>
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
                        <div className="col-5">
                            <div className="col">
                                {editing &&
                                <>
                                    {(typeof ronvauTeam["team"] == 'undefined' || ronvauTeam["team"] == "" ) &&
                                        <>
                                            <div className="mt-3 p-0">
                                                <ReactSearchBox
                                                    placeholder="Ajouter l'équipe à une compétition"
                                                    data={compet}
                                                    onSelect={record => setSelectCompet({
                                                            key: record["key"],
                                                            team: record["team"]
                                                        })}
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
                                            <h5>L'équipe est liée à la compétition: {ronvauTeam["team"]["competition"]["name"]}</h5>
                                            <button type={"button"} onClick={handleDeleteCompet} className="btn btn-sm btn-danger">Supprimer l'équipe de cette compétition</button>
                                        </>
                                    }
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RonvauTeamPage;