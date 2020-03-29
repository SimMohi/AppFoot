import React, { useState, useEffect } from "react";
import axios from 'axios';
import CompetitionsAPI from "../services/CompetitionsAPI";
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";

const CompetitionsPage = props => {
    const [competitions, setCompetitions] = useState([]);

    const FindCompetitions = async () => {
        try {
            const data = await CompetitionsAPI.findAll();
            setCompetitions(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect( () => {
        FindCompetitions();
    }, []);


    const handleDelete = id => {
        const originalCompetitions = [...competitions];
        setCompetitions(competitions.filter(competition => competition.id !== id));
        try {
            CompetitionsAPI.deleteCompet(id);
            setCompetitions(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    return ( <>
        <h1>Liste des compétitions</h1>
        <Link to={"/competition/new/"} className={"btn btn-info float-right"}>Nouvelle compétition</Link>
        <table className="table table-hover">
            <thead>
            <tr>
                <th>Identifiant</th>
                <th>Nom</th>
                <th>format</th>
                <th>season</th>
            </tr>
            </thead>
            <tbody>
            {competitions.map(competition =>
                <tr key={competition.id}>
                    <td>{competition.id}</td>
                    <td>{competition.name}</td>
                    <td>{competition.format}</td>
                    <td>{competition.season}</td>
                    <td>
                        <Link to={"/competition/"+competition.id+"/view"} className={"btn btn-sm btn-primary mr-3"}>Sélectionner</Link>
                        <Link to={"/competition/"+competition.id} className={"btn btn-sm btn-primary mr-3"}>Editer</Link>
                        <button onClick={() => handleDelete(competition.id)} className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </>);
}
export default CompetitionsPage;
