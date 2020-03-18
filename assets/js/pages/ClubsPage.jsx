import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";

const ClubsPage = props => {
    const [clubs, setClubs] = useState([]);

    const FindClub = async () => {
        try {
            const data = await ClubsAPI.findAll();
            setClubs(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect( () => {
        FindClub();
    }, []);

    const handleDelete = id => {
        const originalClubs = [...clubs];
        setClubs(clubs.filter(club => club.id !== id));
        try {
            ClubsAPI.deleteClub(id);
            setClubs(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    return ( <>
        <h1>Liste des clubs</h1>
        <Link to={"/club/new/"} className={"btn btn-info float-right"}>Nouvelle compétition</Link>
        <table className="table table-hover">
            <thead>
            <tr>
                <th>Identifiant</th>
                <th>Nom</th>
                <th>Adresse</th>
            </tr>
            </thead>
            <tbody>
            {clubs.map(club =>
                <tr key={club.id}>
                    <td>{club.id}</td>
                    <td>{club.name}</td>
                    <td>{club.address}</td>
                    <td>
                        <Link to={"/club/"+club.id} className={"btn btn-sm btn-primary mr-3"}>Sélectionner</Link>
                        <button onClick={() => handleDelete(club.id)} className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </>);
}

export default ClubsPage;