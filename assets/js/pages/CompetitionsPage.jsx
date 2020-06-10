import React, { useState, useEffect } from "react";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {Link} from "react-router-dom";

const CompetitionsPage = props => {
    const [competitions, setCompetitions] = useState([]);
    const [reload, setReload] = useState(0);
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
    }, [reload]);


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

    const visible = async (id, visible) => {
        const data = {
            id: id,
            visible: visible
        }
        try{
            await CompetitionsAPI.competVisible(data);
        } catch (e) {

        }
        setReload(reload+1);
    }

    return ( <>
        <h1>Liste des compétitions</h1>
        <Link to={"/competition/new/"} className={"btn btn-warning mb-3 float-right"}>Nouvelle compétition</Link>
            <table className="table table-hover whiteBorder">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>saison</th>
                </tr>
                </thead>
                <tbody>
                {competitions.map(competition =>
                    <tr key={competition.id}>
                        <td>{competition.name}</td>
                        <td>{competition.season}</td>
                        <td>
                            <Link to={"/competition/"+competition.id+"/view"} className={"btn btn-sm btn-secondary mr-3"}>Sélectionner</Link>
                            <Link to={"/competition/"+competition.id} className={"btn btn-sm btn-warning mr-3"}>Editer</Link>
                            {competition.visible &&
                            <button onClick={() => visible(competition.id, false)}
                                    className="btn btn-sm btn-outline-danger mr-3">Rendre invisible</button>
                            ||
                            <button onClick={() => visible(competition.id, true)}
                                    className="btn btn-sm btn-outline-warning mr-3">Rendre visible</button>
                            }
                            <button onClick={() => handleDelete(competition.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
    </>);
}
export default CompetitionsPage;
