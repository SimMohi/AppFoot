import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import TeamsAPI from "../services/TeamsAPI";

const MatchPages = props => {
    const {id} = props.match.params;
    const [teams, setTeams] = useState([]);
    const [matchDayNumber, setMatchDayNumber] = useState(0);
    const [numberTeam, setNumberTeam] = useState(0);
    const [selectedTeamsA, setSelectedTeamsA] = useState({});
    const [selectedTeamsB, setSelectedTeamsB] = useState({});
    const [selectedMatchDay, setSelectedMatchDay] = useState(0);

    const FindMatchDayNumber = async () => {
        const compet = await CompetitionsAPI.find(id);
        setMatchDayNumber(compet.matchDayNumber);
    }

    const changeMatchDay = ({ currentTarget }) => {
        setSelectedMatchDay(currentTarget.value);
    }


    const FindTeams = async () => {
        try {
            const data = await TeamsAPI.findAll();
            setTeams(data);
            setNumberTeam(data.length);
        } catch (error) {
            console.log(error.response);
        }
    }

    const createOptions = (matchDayNumber) => {
        let options = [];
        for (let i = 0; i < matchDayNumber; i++) {
            options.push(<option key={i} value={i}>Journée {i}</option>)
        }
        return options
    }

    const handleChangeA = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectedTeamsA({...selectedTeamsA, [name] : value});
    }

    const handleChangeB = ({ currentTarget }) => {
        let { name, value } = currentTarget;
        setSelectedTeamsB({...selectedTeamsB, [name] : value});
    }

    const createOptionsTeam = (teams) => {
        let options = [];
        options.push(<option key={"default"} value={"default"} disabled>Choissisez une équipe</option>)
        for (let i = 0; i < teams.length; i++) {
            options.push(<option key={i} value={teams[i].id} >{teams[i].idClub.name}</option>)
        }
        return options
    }

    const createMatchFields = (numberTeam) => {
        let options = [];
        for (let i = 0; i < numberTeam/2; i++) {
            options.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>
                        <select className="form-control selectMatch" id={"matchDayA"+i} name={"matchDay"+i} value={selectedTeamsA["matchDay"+i] ||"default"} onChange={handleChangeA}>
                            {createOptionsTeam(teams)}
                        </select>
                    </td>
                    <td>-</td>
                    <td>
                        <select className="form-control selectMatch" id={"matchDayB"+i} name={"matchDay"+i} value={selectedTeamsB["matchDay"+i] ||"default"} onChange={handleChangeB}>
                            {createOptionsTeam(teams)}
                        </select>
                    </td>
                </tr>
            )
        }
        return options
    }

    const handleSubmit = () => {
        for (const key in selectedTeamsA) {
            if (key in selectedTeamsB) {
                console.log("Key :" + key + " value: " + selectedTeamsA[key] + "/" + selectedTeamsB[key]);
            } else {
                let sub = key.substr(8);
                let num = parseInt(sub);
                num = num + 1;
                console.log("Match numéro " + num + " non complet");
            }
        }
        for (const key in selectedTeamsB) {
            if (!(key in selectedTeamsA)) {
                let sub = key.substr(8);
                let num = parseInt(sub);
                num = num + 1;
                console.log("Match numéro " + num + " non complet");
            }
        }
    }


    useEffect( () => {
        FindTeams();
        FindMatchDayNumber();
    }, []);

    return(
        <>
            <div className="form-group w-25">
                <select className="form-control" id="matchDay" name={"matchDay"} onChange={changeMatchDay}>
                    {createOptions(matchDayNumber)}
                </select>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Num</th>
                    <th>Equipe à domicile</th>
                    <th></th>
                    <th>Equipe à l'extérieur</th>
                </tr>
                </thead>
                <tbody>
                {createMatchFields(numberTeam)}
                </tbody>
            </table>
            <button onClick={handleSubmit} className="btn btn-success float-right">Enregistrer</button>
        </>
    );
}
export default MatchPages;