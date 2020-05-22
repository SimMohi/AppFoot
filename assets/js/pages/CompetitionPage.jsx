import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";

const CompetitionPage = props => {

    const {id} = props.match.params;
    const [editing, setEditing] = useState(false);

    const [competition, setCompetition] = useState({
        season: "",
        matchDayNumber: "",
    });

    const [errors, setErrors] = useState({
        season: "",
        matchDayNumber: ""
    });

    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState({});

    const fetchCompetition = async id => {
        try{
            const {season, matchDayNumber, name} = await CompetitionsAPI.find(id);
            setSelectedName(name);
            setCompetition({season, matchDayNumber});
        } catch (e) {
            console.log(e.response);
        }
    };

    const fetchNameCompetition = async () => {
        try{
            const data = await CompetitionsAPI.findAllName();
            setNames(data);
            if (id ==  "new"){
                setSelectedName(data[0]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleChangeCompet = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCompetition({...competition, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let copy = JSON.parse(JSON.stringify(competition));
        copy["name"] = "/api/name_competitions/" + selectedName.id;
        try {
            if (editing){
                await CompetitionsAPI.update(id, copy);
                toast.success("La compétition a bien été modifiée");
            } else {
                await CompetitionsAPI.create(copy);
                toast.success("La compétition a bien été créée");
                props.history.replace("/competition");
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

    const selectName = ({currentTarget}) => {
        let { value } = currentTarget;
        let current = names.find(n => n.id == value);
        setSelectedName(current);
    }


    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCompetition(id);
        }
        fetchNameCompetition();
    }, [id]);

    return  (
        <>
            {!editing && <h1>Création d'une nouvelle Compétition</h1> ||
            <div className={"container"}>
                <div className="row">
                    <h1 className={"col-8"}>Modification d'une Compétition</h1>
                    <div className="col-4">
                        <Link to={"/competition/"+id+"/équipes"} className={"btn btn-primary mt-3 float-right"}>Gérer les équipes</Link>
                    </div>
                </div>
            </div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exampleSelect1">Championnat</label>
                    <select className="form-control" id="exampleSelect1" onChange={selectName} value={selectedName["id"]}>
                        {names.map(name =>
                        <option key={name.id} value={name.id}>
                            {name.name}
                        </option>
                        )}
                    </select>
                </div>
                <Field name={"season"} label={"Saison pendant laquelle se déroule la compétition"} type={"text"} value={competition.season} onChange={handleChangeCompet} error={errors.season}/>
                <Field name={"matchDayNumber"} label={"Nombre de journées de championnat"} type={"number"} min={"1"} value={competition.matchDayNumber} onChange={handleChangeCompet}
                       error={errors.matchDayNumber}></Field>
                <div className="from-group ">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/competition"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CompetitionPage;

