import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import ClubsAPI from "../services/ClubsAPI";
import TeamsAPI from "../services/TeamsAPI";

const CompetitionPage = props => {

    const {id} = props.match.params;

    const [competition, setCompetition] = useState({
        name: "",
        format: "",
        season: "",
        matchDayNumber: ""
    });

    // const [idClubs, setIdClubs] = useState({});

    const idClubs = {};

    const postTeam = {
        idClub: "",
        idCompetition: "",
    }

    const [team, setTeam] = useState({
        idClub: "",
        idCompetition: "",
    });

    const [clubs, setClubs] = useState([]);

    const getClubs = async () => {
        try{
            const allClubs = await ClubsAPI.findAll();
            setClubs(allClubs);
        } catch (error) {
            console.log(error.response);
        }
    };

    const [errors, setErrors] = useState({
        name: "",
        format: "",
        season: "",
        matchDayNumber: ""
    });

    const [editing, setEditing] = useState(false);

    const fetchCompetition = async id => {
        try {
            const { name, format, season, matchDayNumber} = await CompetitionsAPI.find(id);
            setCompetition({ name, format, season, matchDayNumber});
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCompetition(id);
            getClubs();
            setTeam({...team, ["idCompetition"] : "/api/competitions/"+id});
        }
    }, [id]);


    const handleChangeCompet = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCompetition({...competition, [name]: value});
    };

    const handleChangeClub = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        if(idClubs[value] === 1){
            idClubs[value] = 0;
        } else if(idClubs[value] === 0 || typeof idClubs[value] == 'undefined') {
            idClubs[value] = 1;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing){
                const response = await CompetitionsAPI.update(id, competition)
            } else {
                const response = await CompetitionsAPI.create(competition);
                props.history.replace("/competition");
            }
            for (const index in idClubs) {
                if(idClubs[index] === 1){
                    postTeam["idCompetition"] = team["idCompetition"];
                    postTeam["idClub"] = "/api/clubs/"+index;
                    const responseTeam = await TeamsAPI.create(postTeam);
                }
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

    return  (
        <>
            {!editing && <h1>Création d'une nouvelle Compétition</h1> || <h1>Modification d'une Compétition</h1>}

            <form onSubmit={handleSubmit}>
                <Field name={"name"} label={"Nom de la Compétition"} type={"text"} value={competition.name} onChange={handleChangeCompet} error={errors.name}/>
                <Field name={"format"} label={"Format de la Compétition"} type={"text"} value={competition.format} onChange={handleChangeCompet} error={errors.format}/>
                <Field name={"season"} label={"Saison pendant laquelle se déroule la compétition"} type={"text"} value={competition.season} onChange={handleChangeCompet} error={errors.season}/>
                <Field name={"matchDayNumber"} label={"Nombre de journées de championnat"} type={"number"} min={"1"} value={competition.matchDayNumber} onChange={handleChangeCompet} error={errors.matchDayNumber}></Field>
                <div className="form-check">
                    {clubs.map(club =>
                        <div className="form-check" key={club.id}>
                            <input className="form-check-input" name={"idClub"} type="checkbox" value={club.id}
                                   id={"check" + club.id} onChange={handleChangeClub}/>
                            <label className="form-check-label" htmlFor={"check" + club.id}>
                                {club.name}
                            </label>
                        </div>
                    )}
                </div>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                    <Link to={"/competition"} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CompetitionPage;

