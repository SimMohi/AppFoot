import React, { useState, useEffect } from "react";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {Link} from "react-router-dom";

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


    return ( <>
        <h1 className={"mb-5"}>Liste des compétitions</h1>
        <table className="table table-hover">
            <thead>
            <tr>
                <th>Nom</th>
                <th>saison</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {competitions.map(competition =>
                    competition.visible &&
                    <tr key={competition.id}>
                        <td>{competition.name}</td>
                        <td>{competition.season}</td>
                        <td>
                            <Link to={"/competition/" + competition.id + "/view"}
                                  className={"btn btn-sm btn-primary mr-3"}>Classement</Link>
                            <Link to={"/competition/" + competition.id + "/matchs"}
                                  className={"btn btn-sm btn-secondary mr-3"}>Calendrier des matchs</Link>
                        </td>
                    </tr>
            )}
            </tbody>
        </table>
    </>);
}
export default CompetitionsPage;
