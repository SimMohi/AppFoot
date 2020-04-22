import React, {useEffect, useState} from 'react';
import axios from "axios";
import ReactSearchBox from "react-search-box";
import TeamsAPI from "../services/TeamsAPI";
import {toast} from "react-toastify";

const CompetitionTeamsPage = props => {

    const {id} = props.match.params;
    const [clubs, setClubs] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectClub, setSelectClub] = useState(0);
    const [selectMatch, setSelectMatch] = useState({
    });

    const fetchClubs = async () => {
        axios.all([
            axios.get("http://localhost:8000/api/competitions/" + id),
            axios.get("http://localhost:8000/api/clubs/"),
        ]).then(axios.spread((...responses) => {
            const competTeams = responses[0].data["teams"];
            for (let i = 0; i < competTeams.length; i++){
                let date = new Date(competTeams[i].hour);
                let hours = date.getHours();
                let minutes = date.getMinutes();
                if (hours < 10){
                    hours = hours+"0";
                }
                if (minutes < 10){
                    minutes = minutes+"0";
                }
                let hhmm = hours+":"+minutes;
                competTeams[i].hour = hhmm;
            }
            setTeams(competTeams);
            const allClubs = responses[1].data["hydra:member"];
            let teamClub = [];
            for (let i = 0; i < competTeams.length; i++) {
                teamClub.push(competTeams[i].club["@id"]);
            }
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
        })).catch(errors => {
            console.log(errors.response);
        })
    }

    const handleChangeSelectMatch = ({ currentTarget }) => {
        const { name, value, id } = currentTarget;
        let copyTeams = JSON.parse(JSON.stringify(teams));
        copyTeams[id][name] = value;
        setTeams(copyTeams);
    }

    const handleAddSelectMatch = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectMatch({...selectMatch, [name] : value});
    }

    const addTeam = async () => {
        if (selectClub == 0){
            toast.error("Séléctionnez une équipe");
            return ;
        }
        if (selectMatch["day"] == "0" || typeof selectMatch["day"] == 'undefined'){
            toast.error("Sélectionnez un jour");
            return ;
        }
        if (typeof selectMatch["hour"] == 'undefined'){
            toast.error("Sélectionnez une heure");
            return ;
        }
        return ;
        let postTeam = {};
        postTeam["competition"] = "/api/competitions/"+id;
        postTeam["club"] = "/api/clubs/"+selectClub;
        postTeam["hour"] = selectMatch["hour"];
        postTeam["day"] = selectMatch["day"];
        try {
            await TeamsAPI.create(postTeam);
            toast.success("L'équipe à été ajoutée à la compétition");
        } catch (e) {
            toast.error("L'équipe n'a pas été ajoutée à la compétition");
        }
    }

    const modifyTeam = async (index) => {
        if (teams[index]["day"] == "0" || typeof teams[index]["day"] == 'undefined'){
            toast.error("Sélectionnez un jour");
            return ;
        }
        if (typeof teams[index]["hour"] == 'undefined' || teams[index]["hour"] == "NaN:NaN"){
            toast.error("Sélectionnez une heure");
            return ;
        }
        let copyTeam = JSON.parse(JSON.stringify(teams[index]));
        copyTeam["club"] = copyTeam["club"]["@id"];
        try{
            await TeamsAPI.update(copyTeam.id, copyTeam);
            toast.success("La modification a réussi");
        } catch (e) {
            toast.error("La modification a échoué");
        }
        console.log(copyTeam);
    }

    useEffect(() => {
        fetchClubs();
    }, []);

    return(
        <>
            <h5 className={"mt-4"}>Ajouter ou modifier une équipe et l'horaire de ses matchs à domicile</h5>
            <table className="table table-hover text-center mt-5">
                <thead className={"container"}>
                    <tr className={"row"}>
                        <th className={"col-4"}>Equipe</th>
                        <th className={"col-3"}>Jour du match</th>
                        <th className={"col-3"}>Heure du match</th>
                        <th className={"col-2"}></th>
                    </tr>
                </thead>
                <tbody className={"container"}>
                {teams.map((team, index) =>
                    <tr key={team.id} className="row">
                        <td className="col-4">
                            {team.club.name}
                        </td>
                        <td className="col-3">
                            <select className="form-control" name={"day"} value={team.day} id={index}
                                    onChange={handleChangeSelectMatch}>
                                <option value="0">Choissisez un jour</option>
                                <option value={"Lundi"}>Lundi</option>
                                <option value={"Mardi"}>Mardi</option>
                                <option value={"Mercredi"}>Mercredi</option>
                                <option value={"Jeudi"}>Jeudi</option>
                                <option value={"Vendredi"}>Vendredi</option>
                                <option value={"Samedi"}>Samedi</option>
                                <option value={"Dimanche"}>Dimanche</option>
                            </select>
                        </td>
                        <td className={"col-3"}>
                            <input type="time" name={"hour"} className={"form-control"} step={300} id={index}
                                   value={team.hour} onChange={handleChangeSelectMatch}/>
                        </td>
                        <td className="col-2 ml-auto">
                            <button type={"button"} onClick={()=> modifyTeam(index)} className="btn btn-primary">Modifier</button>
                        </td>
                    </tr>
                )}
                <tr className={"row"}>
                    <td className={"col-4"}>
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
                    <td className="col-3">
                        <select className="form-control" name={"day"} value={selectMatch["day"]}
                                onChange={handleAddSelectMatch}>
                            <option value="0">Choissisez un jour</option>
                            <option value={"Lundi"}>Lundi</option>
                            <option value={"Mardi"}>Mardi</option>
                            <option value={"Mercredi"}>Mercredi</option>
                            <option value={"Jeudi"}>Jeudi</option>
                            <option value={"Vendredi"}>Vendredi</option>
                            <option value={"Samedi"}>Samedi</option>
                            <option value={"Dimanche"}>Dimanche</option>
                        </select>
                    </td>
                    <td className={"col-3"}>
                        <input type="time" name={"hour"} className={"form-control"} step={300}
                               value={selectMatch["hour"]} onChange={handleAddSelectMatch}/>
                    </td>
                    <td className="col-2 ml-auto">
                        <button type={"button"} onClick={addTeam} className="btn btn-success">Ajouter</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    )
}

export default CompetitionTeamsPage;