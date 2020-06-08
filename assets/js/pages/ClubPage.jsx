import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";
import {toast} from "react-toastify";

const ClubPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);
    const [club, setClub] = useState({
        name: "",
    });

    const [address, setAddress] = useState({
        street : "",
        city: "",
        number: "",
        code: ""
    })
    const [errors, setErrors] = useState({
        name: "",
        address: "",
    });

    const fetchClub = async id => {
        try {
            const { name, address } = await ClubsAPI.find(id);
            setClub({ name, address });
            if (address != null){
                setAddress(address);
            }
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchClub(id);
        }
    }, [id]);


    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setClub({...club, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let copyAdd = JSON.parse(JSON.stringify(address));
        try {
            if (editing){
                copyAdd["clubId"] = id;
                delete club["address"];
                const response = await ClubsAPI.update(id, club);
                await ClubsAPI.postClubAddress(copyAdd);
                toast.success("Le club a bien été modifié");
            } else {
                const response = await ClubsAPI.create(club);
                copyAdd["clubId"] = response["data"].id;
                await ClubsAPI.postClubAddress(copyAdd);
                toast.success("Le club a bien été créé");
                props.history.replace("/club");
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

    const handleChangeAdd = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setAddress({...address, [name]: value});
    };

    return(
        <>
            {!editing && <h1 className={"mb-5"}>Création d'un nouveau Club</h1> || <h1 className={"mb-5"}>Modification d'un Club</h1>}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-4">
                        <Field name={"name"} label={"Nom du club"} type={"text"} value={club.name} onChange={handleChange} error={errors.name}/>
                    </div>
                    <div className="col-8">
                        <Field name={"street"} label={"Rue"} type={"text"} value={address.street} onChange={handleChangeAdd} error={errors.street}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <Field name={"city"} label={"Ville"} type={"text"} value={address.city} onChange={handleChangeAdd} error={errors.city}/>
                    </div>
                    <div className="col-4">
                        <Field name={"number"} label={"Numéro"} type={"number"} value={address.number} onChange={handleChangeAdd} error={errors.number}/>
                    </div>
                    <div className="col-4">
                        <Field name={"code"} label={"Code postal"} type={"text"} value={address.code} onChange={handleChangeAdd} error={errors.code}/>
                    </div>
                </div>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/club"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    )
}

export default ClubPage;