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

        const handleDelete = id => {
            const originalRonvauTeam = [...ronvauTeams];
            setRonvauTeams(ronvauTeams.filter(ronvauTeams => ronvauTeams.id !== id));
            try {
                RonvauTeamAPI.deleteTeamRonvau(id);
            } catch (error) {
                setRonvauTeams(originalRonvauTeam)
            }
        };

        useEffect( () => {
            FindRonvauTeam();
        }, []);

        console.log(ronvauTeams);

        return ( <>
            <h1>Liste des equipes</h1>
            <Link to={"/equipeRonvau/new/"} className={"btn btn-info float-right"}>Nouvelle équipe</Link>
            <table className="table table-hover text-center">
                <thead>
                <tr>
                    <th>Catégorie</th>
                    <th>coach</th>
                    <th>Nombre de joueurs</th>
                </tr>
                </thead>
                <tbody>
                {ronvauTeams.map(ronvauTeam =>
                    <tr key={ronvauTeam.id}>
                        <td>{ronvauTeam.category}</td>
                        <td>{ronvauTeam.coach}</td>
                        <td>{ronvauTeam["userTeams"].length}</td>
                        <td>
                            <Link to={"/equipeRonvau/"+ronvauTeam.id} className={"btn btn-sm btn-primary mr-3"}>Editer</Link>
                            <button onClick={() => handleDelete(ronvauTeam.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </>);
}

export default RonvauTeamsPage;