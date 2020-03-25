import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import TeamsAPI from "../services/TeamsAPI";

const MatchPages = props => {
    const {id} = props.match.params;
    const [teams, setTeams] = useState([]);
    const [matchDayNumber, setMatchDayNumber] = useState(0);
    const [numberTeam, setNumberTeam] = useState(0);
    const [search, setSearch] = useState([]);

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

    const createOptionsTeam = (teams) => {
        let options = [];
        for (let i = 0; i < teams.length; i++) {
            options.push(<option key={i} value={teams[i].idClub.name}>{teams[i].idClub.name}</option>)
        }
        return options
    }


    const handleSearch = ({ currentTarget }) => {
        setSearch({...search, [currentTarget.id] : currentTarget.value});
    };

    const createMatchFields = (numberTeam) => {
        let options = [];
        for (let i = 0; i < numberTeam; i = i+2) {
            options.push(
                <tr key={i}>
                    <td>
                        <input
                        type="text"
                        id={i}
                        onChange={handleSearch}
                        value={search[i] || ""}
                        className="form-control"
                        placeholder="Rechercher"
                        />
                    </td>
                    <td>-</td>
                    <td>
                        <input
                            type="text"
                            id={i+1}
                            onChange={handleSearch}
                            value={search[i+1] || ""}
                            className="form-control"
                            placeholder="Rechercher"
                        />
                    </td>
                </tr>
            )
        }
        return options
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
                <select className="form-control" id="matchDay" name={"matchDay"}>
                    {createOptionsTeam(teams)}
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
        </>
    );
}

export default MatchPages;