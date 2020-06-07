import React, {useEffect, useState} from 'react';
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import ReactSearchBox from "react-search-box";
import {toast} from "react-toastify";
import UsersTeamAPI from "../services/UsersTeamAPI";
import usersAPI from "../services/usersAPI";
import {Link} from "react-router-dom";
const RonvauTeamMember = props => {
    const {id} = props.match.params;
    const [reload, setReload] = useState(0);
    const [users, setUsers] = useState([]);
    const [ronvauTeam, setRonvauTeam] = useState({
        id: "",
        category: "",
        coach: "",
        userTeams: [],
    });
    const [selectUser, setSelectUser] = useState({
        role: 0,
    });

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

    const fetchRonvauTeam = async idRT => {
        try {
            const { id, category, coach, userTeams, team} = await RonvauTeamAPI.find(idRT);
            setRonvauTeam({ id, category, coach, userTeams});
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleChangeSelect = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectUser({...selectUser, [name] : value});
    }

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
        } else if (selectUser.role == 3){
            newUserTeam["isPlayer"] = false;
            newUserTeam["isStaff"] = false;
        }
        try{
            await UsersTeamAPI.create(newUserTeam);
            toast.success("L' utilisateur a bien été ajouté à l'équipe");
        } catch (e) {
            toast.error("Erreur lors de l'ajout d'un utilisateur à une équipe");
        }
        setReload(reload+1);
    }

    useEffect(() => {
        fetchRonvauTeam(id);
        fetchUsers();
    }, [id, reload]);

    return(
        <>
            <Link to={"/equipeRonvau/"+ id} className={"btn btn-info mr-3 mb-5"}>Retour</Link>
            <div className="row">
                <div className="col-8">
                    <h4>Liste des membres de cette équipe</h4>
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
                </div>
                <div className="col-4">
                    <h6>Ajouter un membre à l'équipe</h6>
                    <div className="mt-5 p-0">
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
                        <option value={3}>Supporter</option>
                        <option value={0}>Joueur</option>
                        <option value={1}>Coach</option>
                        <option value={2}>Coach - Joueur</option>
                    </select>
                    <div className={"mt-3 mb-5"}>
                        <button type={"button"} onClick={() => AddUserTeam()}
                                className="btn btn-primary ml-auto d-block">Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RonvauTeamMember;