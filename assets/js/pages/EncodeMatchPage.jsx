import React, {useEffect, useState} from 'react';
import PlayerMatchAPI from "../services/PlayerMatchAPI";
import MatcheAPI from "../services/MatcheAPI";
import Field from "../components/forms/Fields";

const EncodeMatchPage = props => {

    const {id} = props.match.params;
    const [match, setMatch] = useState({});

    const fetchMatch = async () =>{
        try{
            const response = await MatcheAPI.find(id);
            setMatch(response);
        } catch (e) {
            console.log(e.response);
        }
    }

    const changeCheckBoxPlay = ({ currentTarget }) => {
            const {id} = currentTarget;
            let index = id.replace("play","");
            let copyMatch = JSON.parse(JSON.stringify(match));
            if (copyMatch["playerMatches"][index]["played"] == true){
                copyMatch["playerMatches"][index]["played"] = false;
            } else {
                copyMatch["playerMatches"][index]["played"] = true
            }
            setMatch(copyMatch);
    }


    const handleChange = ({ currentTarget }) => {
        const { name, value, id } = currentTarget;
        let index = id.replace(name,"");
        let copyMatch = JSON.parse(JSON.stringify(match));
        copyMatch["playerMatches"][index][name] = value;
        setMatch(copyMatch);
    };

    const handleSubmit = async () => {
        let playerMatch = JSON.parse(JSON.stringify(match["playerMatches"]));
        try {
            await MatcheAPI.postEncodeMatch(playerMatch);
        }catch (e) {
            toast.error("Les statistiques ont bien été enregistrées");
        }

    }

    useEffect( () => {
        fetchMatch();
    }, [id]);


    if (typeof match.id != 'undefined'){
        return(
            <>
                <h3>{match.homeTeam.club.name} - {match.visitorTeam.club.name} </h3>
                <h5 className={"mt-5"}>Encoder les statistiques des joueurs</h5>
                <table className="mt-5 table table-hover text-center container">
                    <thead>
                    <tr className={"row"}>
                        <th className={"col-4"}>Nom</th>
                        <th className={"col-2"}>A joué</th>
                        <th className={"col-2"}><img src="img/Ball.png" alt="goal" className={"imgEncode"}/></th>
                        <th className={"col-2"}><img src="img/Carton_jaune.png" alt="jaune" className={"imgEncode"}/></th>
                        <th className={"col-2"}><img src="img/Carton_rouge.png" alt="rouge" className={"imgEncode"}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {match["playerMatches"].map((playerMatch, index) =>
                        <tr key={playerMatch.id} className={"row"}>
                            <td className={"col-4"}>{playerMatch["idUserTeam"].userId.lastName+" "+playerMatch["idUserTeam"].userId.firstName}</td>
                            <td className={"custom-control custom-checkbox col-2"}>
                                <input type="checkbox" className="custom-control-input" id={"play"+index} onChange={changeCheckBoxPlay} checked={playerMatch.played}/>
                                <label className="custom-control-label" htmlFor={"play"+index}></label>
                            </td>
                            <td className={"col-2"}>
                                <input type={"number"} className={"form-control"}  min={0}  name={"goal"} id={"goal"+index}
                                       value={playerMatch["goal"] || 0} onChange={handleChange} disabled={!playerMatch.played}/>
                            </td>
                            <td className={"col-2"}>
                                <input type={"number"} className={"form-control"}  min={0}  name={"yellowCard"} id={"yellowCard"+index}
                                       value={playerMatch["yellowCard"] || 0} onChange={handleChange} disabled={!playerMatch.played}/>
                            </td>
                            <td className={"col-2"}>
                                <input type={"number"} className={"form-control"}  min={0}  name={"redCard"} id={"redCard"+index}
                                       value={playerMatch["redCard"] || 0} onChange={handleChange} disabled={!playerMatch.played}/>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={handleSubmit} className="btn btn-success float-right">Enregistrer</button>
            </>
        )
    } else {
        return (<></>);
    }
}

export default EncodeMatchPage;