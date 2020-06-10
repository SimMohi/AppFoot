import React, { useState, useEffect } from 'react';
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {Link} from "react-router-dom";


const RonvauTeamsPage = () => {

    const [ronvauTeams, setRonvauTeams] = useState([]);

    const FindRonvauTeam = async () => {
        try {
            const data = await RonvauTeamAPI.findAll();
            setRonvauTeams(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect( () => {
        FindRonvauTeam();
    }, []);

    return ( <>
        <h1 className={"mb-5"}>Liste des equipes</h1>
        <table className="table table-hover text-center whiteBorder">
            <thead>
            <tr>
                <th>Catégorie</th>
                <th>Nombre de joueurs</th>
            </tr>
            </thead>
            <tbody>
            {ronvauTeams.map(ronvauTeam =>
                <tr key={ronvauTeam.id}>
                    <td>{ronvauTeam.category}</td>
                    <td>{ronvauTeam["userTeams"].length}</td>
                    <td>
                        <Link to={"/equipeRonvau/"+ronvauTeam.id+"/select"} className={"btn btn-sm btn-warning mr-3"}>Sélectionner</Link>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </>);
}

export default RonvauTeamsPage;