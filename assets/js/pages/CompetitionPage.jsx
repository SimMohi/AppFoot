import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import {toast} from "react-toastify";
import ClubsAPI from "../services/ClubsAPI";
import ReactSearchBox from "react-search-box";
import TeamsAPI from "../services/TeamsAPI";
import Modal from "react-bootstrap/Modal";
import DateFunctions from "../services/DateFunctions";

const CompetitionPage = props => {

    const {id} = props.match.params;
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [clubs, setClubs] = useState([]);
    const [selectClub, setSelectClub] = useState(0);
    const [reload, setReload] = useState(0);
    const [competition, setCompetition] = useState({
        season: "",
        name: "",
        teams: [],
    });

    const [selectedTeam, setSelectedTeam] = useState({
        id: 0,
        name: ""
    })

    const [errors, setErrors] = useState({
        season: "",
        name: ""
    });

    const fetchCompetition = async id => {
        try{
            const {season, name, teams} = await CompetitionsAPI.find(id);
            let teamClub = [];
            for (let i = 0; i < teams.length; i++) {
                teamClub.push(teams[i].club["@id"]);
            }
            const allClubs = await ClubsAPI.findAll();
            let copyTeamClub = [];
            for (let i = 0; i < allClubs.length; i++) {
                if (!teamClub.includes(allClubs[i]["@id"])) {
                    copyTeamClub.push({
                        key: allClubs[i]["id"],
                        value: allClubs[i]["name"]
                    });
                }
            }
            setClubs(copyTeamClub);
            setCompetition({season, teams, name});
        } catch (e) {
            console.log(e.response);
        }
    };


    const handleChangeCompet = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCompetition({...competition, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let copy = JSON.parse(JSON.stringify(competition));
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

    const addTeam = async () => {
        if (selectClub == 0){
            toast.error("Séléctionnez une équipe");
            return ;
        }
        let postTeam = {};
        postTeam["competition"] = "/api/competitions/"+id;
        postTeam["club"] = "/api/clubs/"+selectClub;
        try {
            await TeamsAPI.create(postTeam);
            toast.success("L'équipe à été ajoutée à la compétition");
        } catch (e) {
            toast.error("L'équipe n'a pas été ajoutée à la compétition");
        }
        setReload(reload+1);
    }

    const deleteTeam = async (id) => {
        try{
            await TeamsAPI.deleteTeam(id);
            toast.success("équipe supprimée avec succès");
        }catch (e) {

        }
        setShow(false);
        setReload(reload+1);
    }

    const openModal = (team) => {
        console.log(team)
        setShow(true);
        setSelectedTeam({
            id: team.id,
            name: team.club.name
        })
    }

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCompetition(id);
        }
    }, [id, reload]);

    return  (
        <>
            <Link to={"/competition"} className={"btn btn-primary float-right"}>Retour à la liste</Link>
            <div className="row">
                <div className="col-5">
                    {!editing && <h1>Création d'une nouvelle Compétition</h1> ||
                    <div className={"container"}>
                        <div className="row">
                            <h1 className={"col-8 mb-3"}>Modification d'une Compétition</h1>
                            <div className="col-4">
                            </div>
                        </div>
                    </div>
                    }
                    <form onSubmit={handleSubmit}>
                        <Field name={"name"} label={"Nom de la compétition"} type={"text"} value={competition.name} onChange={handleChangeCompet}
                               error={errors.name}></Field>
                        <Field name={"season"} label={"Saison pendant laquelle se déroule la compétition"} type={"text"} value={competition.season} onChange={handleChangeCompet} error={errors.season}/>
                        <div className="from-group ">
                            <button type={"submit"} className="btn btn-success">Enregistrer</button>
                        </div>
                    </form>
                </div>
                <div className="col-1"></div>
                {editing &&
                <div className="col-6">
                    <h3 className={"mt-5"}>Gestion des équipes</h3>
                    <table className="table table-hover text-center mt-5">
                        <thead className={"container"}>
                        <tr className={"row"}>
                            <th className={"col-8"}>Equipe</th>
                            <th className={"col-4"}></th>
                        </tr>
                        </thead>
                        <tbody className={"container"}>
                        <tr className={"row"}>
                            <td className={"col-8"}>
                                <ReactSearchBox
                                    placeholder="Ajouter une équipe à la compétition"
                                    data={clubs}
                                    onSelect={record => setSelectClub(record["key"])}
                                    onFocus={() => {
                                    }}
                                    onChange={() => {
                                    }}
                                    fuseConfigs={{
                                        threshold: 0.05,
                                    }}
                                />
                            </td>
                            <td className="col-4">
                                <button type={"button"} onClick={addTeam} className="btn btn-success">Ajouter</button>
                            </td>
                        </tr>
                        {competition["teams"].map((team, index) =>
                            <tr key={team.id} className="row">
                                <td className="col-8">
                                    {team.club.name}
                                </td>
                                <td className="col-4">
                                    <button type={"button"} onClick={() => openModal(team)}
                                            className="btn btn-danger">Supprimer
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                }
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Body className={""}>
                    <h6>Etes vous sûr de vouloir supprimer l'équipe {selectedTeam.name} de la compétition ? </h6>
                    <h6>Cette action est irréversible.</h6>
                    <button onClick={() => deleteTeam(selectedTeam.id)} className="btn btn-danger float-right">Supprimer</button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CompetitionPage;

