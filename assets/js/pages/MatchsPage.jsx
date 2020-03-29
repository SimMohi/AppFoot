import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import TeamsAPI from "../services/TeamsAPI";

const MatchPages = props => {
    const {id} = props.match.params;
    const [teams, setTeams] = useState([]);
    const [matchDayNumber, setMatchDayNumber] = useState(0);
    const [numberTeam, setNumberTeam] = useState(0);
    const [selectedTeams, setSelectedTeams] = useState({});

    const FindMatchDayNumber = async () => {
        const compet = await CompetitionsAPI.find(id);
        setMatchDayNumber(compet.matchDayNumber);
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

    const handleChange = ({ currentTarget }) => {
        let { id, value } = currentTarget;
        setSelectedTeams({...selectedTeams, [id] : value});
    }

    const createOptionsTeam = (teams) => {
        let options = [];
        options.push(<option key={"default"} value={"default"} disabled>Choissisez une équipe</option>)
        for (let i = 0; i < teams.length; i++) {
            options.push(<option key={i} value={teams[i].idClub.name} >{teams[i].idClub.name}</option>)
        }
        return options
    }

    const createMatchFields = (numberTeam) => {
        let options = [];
        for (let i = 0; i < numberTeam; i = i+2) {
            var j = i+1;
            options.push(
                <tr key={i}>
                    <td>
                        <select className="form-control selectMatch" id={"matchDay"+i} name={"matchDay"+i} value={selectedTeams["matchDay"+i] ||"default"} onChange={handleChange}>
                            {createOptionsTeam(teams)}
                        </select>
                    </td>
                    <td>-</td>
                    <td>
                        <select className="form-control selectMatch" id={"matchDay"+j} name={"matchDay"+j} value={selectedTeams["matchDay"+j] ||"default"} onChange={handleChange}>
                            {createOptionsTeam(teams)}
                        </select>
                    </td>
                </tr>
            )
        }
        return options
    }

    const handleSubmit = () => {
        console.log(selectedTeams);
    }


    useEffect( () => {
        FindTeams();
        FindMatchDayNumber();
    }, []);

    return(
        <>
            <div className="form-group w-25">
                <select className="form-control" id="matchDay" name={"matchDay"}>
                    {createOptions(matchDayNumber)}
                </select>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
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