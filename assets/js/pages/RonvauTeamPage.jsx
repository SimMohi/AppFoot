import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import ReactSearchBox from 'react-search-box'
import usersAPI from "../services/usersAPI";


const RonvauTeamPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [users, setUsers] = useState([]);

    const [ronvauTeam, setRonvauTeam] = useState({
        category: "",
        coach: "",
    });
    const [errors, setErrors] = useState({
        category: "",
        coach: "",
    });


    const fetchRonvauTeam = async id => {
        try {
            const { category, coach} = await RonvauTeamAPI.find(id);
            setRonvauTeam({ category, coach});
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


    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchRonvauTeam(id);
            fetchUsers();
        }
    }, [id]);

    console.log(users);
    return  (
        <>
            {!editing && <h1>Création d'une nouvelle équipe</h1> || <h1>Modification d'une équipe</h1>}
            <form onSubmit={handleSubmit}>
                <Field name={"category"} label={"Catégorie de l'équipe"} type={"text"} value={ronvauTeam.category} onChange={handleChange} error={errors.category}/>
                <Field name={"coach"} label={"Coach de l'équipe"} type={"text"} value={ronvauTeam.coach} onChange={handleChange} error={errors.coach}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/equipeRonvau"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
            <div>
                <div className="mt-4">
                    <ReactSearchBox
                        placeholder="Chercher un utilisateur"
                        data={users}
                        onSelect={record => console.log(record)}
                        onFocus={() => {
                            console.log('This function is called when is focussed')
                        }}
                        onChange={value => console.log(value)}
                        fuseConfigs={{
                            threshold: 0.05,
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default RonvauTeamPage;