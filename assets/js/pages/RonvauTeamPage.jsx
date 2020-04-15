import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import ReactSearchBox from 'react-search-box'
import usersAPI from "../services/usersAPI";
import UsersTeamAPI from "../services/UsersTeamAPI";


const RonvauTeamPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(0);
    const [selectUser, setSelectUser] = useState({
        role: 0,
    });

    const [ronvauTeam, setRonvauTeam] = useState({
        category: "",
        coach: "",
        userTeams: []
    });
    const [errors, setErrors] = useState({
        category: "",
        coach: "",
        select: ""
    });


    const fetchRonvauTeam = async id => {
        try {
            const { category, coach, userTeams} = await RonvauTeamAPI.find(id);
            setRonvauTeam({ category, coach, userTeams});
        } catch (error) {
            console.log(error.response);
        }
    };

    const fetchUsers = async () =>{
        const allUsers = await usersAPI.findAll();
        let newArray = [];
        for (let i = 0; i < allUsers.length; i++){
            newArray.push({
                "key": allUsers[i].id,
                "value": allUsers[i].lastName+ " " + allUsers[i].firstName,
            });
        }
        setUsers(newArray);
    }


    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setRonvauTeam({...ronvauTeam, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing){
                await RonvauTeamAPI.update(id, ronvauTeam);
                toast.success("L'équipe a bien été modifiée");
                props.history.replace("/equipeRonvau");
            } else {
                await RonvauTeamAPI.create(ronvauTeam);
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
            toast.error("Renseigner un joueur");
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
        console.log(currentTarget);
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


    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchRonvauTeam(id);
            fetchUsers();
        }
    }, [id, reload]);

    console.log(ronvauTeam);
    return  (
        <>
            {!editing && <h1>Création d'une nouvelle équipe</h1> || <h1>Modification d'une équipe</h1>}
            <form onSubmit={handleSubmit}>
                <Field name={"category"} label={"Catégorie de l'équipe"} type={"text"} value={ronvauTeam.category} onChange={handleChange} error={errors.category}/>
                <Field name={"coach"} label={"Coach de l'équipe"} type={"text"} value={ronvauTeam.coach} onChange={handleChange} error={errors.coach}/>
                <div className={"container"}>
                    <div className="row">
                        <div className="mt-3 col-4 p-0">
                            <ReactSearchBox
                                placeholder="Chercher un utilisateur"
                                data={users}
                                onSelect={record => setSelectUser({...selectUser, ["id"] : record["key"]})}
                                onFocus={() => {
                                }}
                                onChange={value => console.log(value)}
                                fuseConfigs={{
                                    threshold: 0.05,
                                }}
                            />
                        </div>
                        <select className="form-control col-2 mt-3 ml-3" name={"role"} value={selectUser["role"]} onChange={handleChangeSelect}>
                            <option value={0}>Joueur</option>
                            <option value={1}>Coach</option>
                            <option value={2}>Coach - Joueur</option>
                        </select>
                        <button type={"button"} onClick={() => AddUserTeam()} className="btn btn-primary col-1 mt-3 ml-3">Ajouter</button>
                    </div>
                </div>
                <div className="from-group mt-3 float-right">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/equipeRonvau"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
            <table className="mt-5 table table-hover text-center">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>joueur</th>
                    <th>Staff</th>
                </tr>
                </thead>
                <tbody>
                {ronvauTeam["userTeams"].map(userTeam =>
                    <tr key={userTeam.id}>
                        <td>{userTeam.userId.lastName+" "+userTeam.userId.firstName}</td>
                        <td>{userTeam.isPlayer && <i className="fas fa-check"></i> || <i class="fas fa-times"></i>}</td>
                        <td>{userTeam.isStaff && <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}</td>
                        <td>
                            <button onClick={() => handleDelete(userTeam.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

export default RonvauTeamPage;