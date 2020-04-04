import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import TeamsAPI from "../services/TeamsAPI";
import MatcheAPI from "../services/MatcheAPI";
import Field from "../components/forms/Fields";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

const MatchPages = props => {

    const {id} = props.match.params;
    const [teams, setTeams] = useState([]);
    const [matchDayNumber, setMatchDayNumber] = useState(0);
    const [numberTeam, setNumberTeam] = useState(0);
    const [selectedTeamsA, setSelectedTeamsA] = useState({});
    const [selectedTeamsB, setSelectedTeamsB] = useState({});
    const [selectedMatchDay, setSelectedMatchDay] = useState(1);
    const [matchProgrammed, setMatchProgrammed] = useState([]);
    const [change, setChange] = useState(0);

    console.log(matchProgrammed);

    const FindMatchDayNumber = async () => {
        const compet = await CompetitionsAPI.find(id);
        setMatchDayNumber(compet.matchDayNumber);
    }

    const changeMatchDay = ({ currentTarget }) => {
        setSelectedMatchDay(currentTarget.value);
    }

    const findMatches = async () => {
        const match = await MatcheAPI.findMatchDay(selectedMatchDay);
        for (let i = 0; i < match.length; i++){
            if (typeof match[i]["homeTeamGoal"] == 'undefined'){
                match[i]["homeTeamGoal"] = "";
            }
            if (typeof match[i]["visitorTeamGoal"] == 'undefined'){
                match[i]["visitorTeamGoal"] = "";
            }
            setMatchProgrammed( matchProgrammed => [...matchProgrammed, match[i]]);
        }
    }

    const FindTeams = async () => {
        try {
            const data = await TeamsAPI.findCompet(id);
            setTeams(data);
            setNumberTeam(data.length);
        } catch (error) {
            console.log(error.response);
        }
    }

    const createOptions = (matchDayNumber) => {
        let options = [];
        for (let i = 1; i < matchDayNumber+1; i++) {
            options.push(<option key={i} value={i}>Journée {i}</option>)
        }
        return options
    }

    const handleChangeA = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectedTeamsA({...selectedTeamsA, [name] : value});
        setChange(1);
    }

    const handleChangeB = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectedTeamsB({...selectedTeamsB, [name] : value});
        setChange(1);

    }

    const createOptionsTeam = (teams) => {
        let options = [];
        options.push(<option key={"default"} value={"default"} disabled>Choissisez une équipe</option>)
        for (let i = 0; i < teams.length; i++) {
            options.push(<option key={i} value={teams[i].id} >{teams[i].club.name}</option>)
        }
        return options
    }

    const changeScore = ({ currentTarget }) => {
        let { id, value } = currentTarget;
        let AB = id.substr(5,1);
        let indexA = id.substr(6);
        if (AB === "A"){
            const nextState = matchProgrammed.map((a, indexB) => indexA == indexB ? { ...a, ["homeTeamGoal"]: value } : a);
            setMatchProgrammed(nextState);
        } else if (AB === "B"){
            const nextState = matchProgrammed.map((a, indexB) => indexA == indexB ? { ...a, ["visitorTeamGoal"]: value } : a);
            setMatchProgrammed(nextState);
        }
        setChange(1);
    }

    const createMatchFields = (numberTeam, matchProgrammed) => {
        let i = 0;
        let options = [];
        if (matchProgrammed.length > 0){
            for (i; i < matchProgrammed.length; i++) {
                options.push(
                    <tr key={i} className={"row"}>
                        <td className={"col"}>{i+1}</td>
                        <td className={"col-5"}>
                            <div className="row">
                                <select className="form-control selectMatch col-8" id={matchProgrammed[i].homeTeam.club.name}
                                        name={matchProgrammed[i].homeTeam.club.name} disabled={true}>
                                    <option value={matchProgrammed[i].homeTeam.club.name}>{matchProgrammed[i].homeTeam.club.name}</option>
                                </select>
                                {matchProgrammed[i].isOver &&
                                <input type="number" value={matchProgrammed[i]["homeTeamGoal"]} onChange={changeScore}
                                       className={"col-2 m-2"} id={"scoreA" + i} disabled={true}/>
                                ||
                                <input type="number" value={matchProgrammed[i]["homeTeamGoal"]} onChange={changeScore}
                                       className={"col-2 m-2"} id={"scoreA" + i}/>
                                }
                            </div>
                        </td>
                        <td className={"col-5"}>
                            <div className="row">
                                <select className="form-control selectMatch col-8" id={matchProgrammed[i].visitorTeam.club.name}
                                    name={matchProgrammed[i].visitorTeam.club.name} disabled={true}>
                                    <option value={matchProgrammed[i].visitorTeam.club.name}>{matchProgrammed[i].visitorTeam.club.name}</option>
                                </select>
                                {matchProgrammed[i].isOver &&
                                    <input type="number" min={0} value={matchProgrammed[i]["visitorTeamGoal"]} onChange={changeScore} className={"col-2 m-2"} id={"scoreB"+i} disabled={true}/>
                                    ||  <input type="number" min={0} value={matchProgrammed[i]["visitorTeamGoal"]} onChange={changeScore} className={"col-2 m-2"} id={"scoreB"+i}/>
                                }
                            </div>
                        </td>
                    </tr>
                )
            }
        }

        for (i; i < numberTeam/2; i++) {
            options.push(
                <tr key={i} className={"row"}>
                    <td className={"col"}>{i+1}</td>
                    <td className={"col-5"}>
                        <div className="row">
                            <select className="form-control selectMatch col-8" id={"matchDayA"+i} name={"matchDay"+i} value={selectedTeamsA["matchDay"+i] ||"default"} onChange={handleChangeA}>
                                {createOptionsTeam(teams)}
                            </select>
                        </div>
                    </td>
                    <td className={"col-5"}>
                        <div className="row">
                            <select className="form-control selectMatch col-8" id={"matchDayB"+i} name={"matchDay"+i} value={selectedTeamsB["matchDay"+i] ||"default"} onChange={handleChangeB}>
                                {createOptionsTeam(teams)}
                            </select>
                        </div>
                    </td>
                </tr>
            )
        }
        return options
    }

    const handleSubmit = () => {
        if(change === 1) {
            for (const key in selectedTeamsA) {
                if (key in selectedTeamsB) {
                    let matche = {
                        homeTeam: "/api/teams/" + selectedTeamsA[key],
                        visitorTeam: "/api/teams/" + selectedTeamsB[key],
                        isOver: false,
                        matchDay: selectedMatchDay
                    }
                    try {
                        MatcheAPI.create(matche);
                        toast.success("le match a bien été créé");
                    } catch (e) {
                        toast.error("erreur lors de l\'encodage du match");
                    }
                } else {
                    let sub = key.substr(8);
                    let num = parseInt(sub);
                    num = num + 1;
                    toast.error("Matche numéro " + num + " non complet");
                }
            }
            for (const key in selectedTeamsB) {
                if (!(key in selectedTeamsA)) {
                    let sub = key.substr(8);
                    let num = parseInt(sub);
                    num = num + 1;
                    toast.error("Matche numéro " + num + " non complet");
                }
            }
            let match = JSON.parse(JSON.stringify(matchProgrammed));
            for (let i = 0; i < match.length; i++) {
                if (match[i]["homeTeamGoal"] == "" && match[i]["visitorTeamGoal"] == "") {
                    continue;
                }
                if (match[i]["homeTeamGoal"] == ""){
                    match[i]["homeTeamGoal"] = 0;
                } else if(match[i]["visitorTeamGoal"] == ""){
                    match[i]["visitorTeamGoal"] = 0;
                }
                match[i]["homeTeam"] = match[i]["homeTeam"]["@id"];
                match[i]["visitorTeam"] = match[i]["visitorTeam"]["@id"];
                match[i]["isOver"] = true;
                let teamA = JSON.parse(JSON.stringify(matchProgrammed[i]["homeTeam"]));
                console.log(teamA);
                let teamB = JSON.parse(JSON.stringify(matchProgrammed[i]["visitorTeam"]));
                console.log(teamA);
                if (match[i]["homeTeamGoal"] == match[i]["visitorTeamGoal"]){
                    if (typeof teamA["drawn"] == 'undefined'){
                        teamA["drawn"] = 1;
                    } else {
                        teamA["drawn"] += 1;
                    }
                    if (typeof teamB["drawn"] == 'undefined'){
                        teamB["drawn"] = 1;
                    } else {
                        teamB["drawn"] += 1;
                    }
                } else if (match[i]["homeTeamGoal"] < match[i]["visitorTeamGoal"]){
                    if (typeof teamA["lost"] == 'undefined'){
                        teamA["lost"] = 1;
                    } else {
                        teamA["lost"] += 1;
                    }
                    if (typeof teamB["won"] == 'undefined'){
                        teamB["won"] = 1;
                    } else {
                        teamB["won"] += 1;
                    }
                } else if (match[i]["homeTeamGoal"] > match[i]["visitorTeamGoal"]){
                    if (typeof teamB["lost"] == 'undefined'){
                        teamB["lost"] = 1;
                    } else {
                        teamB["lost"] += 1;
                    }
                    if (typeof teamA["won"] == 'undefined'){
                        teamA["won"] = 1;
                    } else {
                        teamA["won"] += 1;
                    }
                }
                teamA["club"] = teamA["club"]["@id"];
                teamB["club"] = teamB["club"]["@id"];
                try  {
                    MatcheAPI.update(match[i].id, match[i]);
                    TeamsAPI.update(teamA["id"], teamA);
                    TeamsAPI.update(teamB["id"], teamB);
                    toast.success("Score encodé avec succès");

                } catch (e) {
                    toast.error("Erreur lors de l'encodage du score du match")
                }
            }

        } else {
            toast.warn("Pas de changements détecté");
        }
        findMatches();
        setMatchProgrammed([]);
        setSelectedTeamsA({});
        setSelectedTeamsB({});
    }

    useEffect( () => {
        setChange(0);
        setSelectedTeamsA({});
        setSelectedTeamsB({});
        setMatchProgrammed([]);
        findMatches();
        FindTeams();
        FindMatchDayNumber();
    }, [selectedMatchDay]);

    return(
        <>
            <div className="form-group w-25">
                <select className="form-control" id="matchDay" name={"matchDay"} onChange={changeMatchDay}>
                    {createOptions(matchDayNumber)}
                </select>
            </div>
            <table className="table table-hover">
                <thead className={"container"}>
                    <tr className={"row"}>
                        <th className={"col"}>Num</th>
                        <th className={"col-5"}>Equipe à domicile</th>
                        <th className={"col-5"}>Equipe à l'extérieur</th>
                    </tr>
                </thead>
                <tbody className={"container"}>
                {createMatchFields(numberTeam, matchProgrammed)}
                </tbody>
            </table>
            <Link to={"/competition/"+id+"/view"} className={"btn btn-primary float-right ml-3"}>Retour à la compétition </Link>
            <button onClick={handleSubmit} className="btn btn-success float-right">Enregistrer</button>
        </>
    );
}
export default MatchPages;