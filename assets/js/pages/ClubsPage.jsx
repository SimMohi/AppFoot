import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";
import authAPI from "../services/authAPI";
import Field from "../components/forms/Fields";

const ClubsPage = props => {

    const [clubs, setClubs] = useState([]);
    const isAdmin = authAPI.getIsAdmin();
    const [search, setSearch] = useState("");
    const [names, setNames] = useState([]);

    const FindClub = async () => {
        try {
            const data = await ClubsAPI.findAll();
            setNames(data);
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

    const changeSearch = ({ currentTarget }) => {
        const value = currentTarget.value;
        let filter = value.toLowerCase();
        let clubArr = [];
        for (let i = 0; i < names.length; i++) {
            let a = names[i]["name"];
            if (a.toLowerCase().indexOf(filter) > -1) {
                clubArr.push(names[i]);
            }
        }
        setClubs(clubArr)
        setSearch(value);
    }

    const adresseFormat = (address) => {
        address.street = address.street.toLowerCase();
        address.street = address.street.replace("rue", "");
        return "rue " + address.street + " " + address.number + ", " + address.code + " " + address.city
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h1>Liste des clubs</h1>
                <Field type={"text"} value={search} onChange={changeSearch} placeholder={"Trier par nom"}/>
                {isAdmin &&
                    <div>
                        <Link to={"/club/new/"} className={"btn btn-info float-right"}> Nouveau club</Link>
                    </div>
                }
            </div>

        <table className="table table-hover mt-3">
            <thead>
            <tr>
                <th>Nom</th>
                <th>Adresse</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {clubs.map(club =>
                <tr key={club.id}>
                    <td>{club.name}</td>
                    <td>{typeof club.address != "undefined" && adresseFormat(club.address) || "Non défini"}</td>
                    <td>
                        {isAdmin &&
                            <>
                                <Link to={"/club/"+club.id} className={"btn btn-sm btn-primary mr-3"}>Modifier</Link>
                                <button onClick={() => handleDelete(club.id)} className="btn btn-sm btn-danger">Supprimer</button>
                            </>
                        }
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        </>
        );
}

export default ClubsPage;