import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import {toast} from "react-toastify";
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
        if (name == "redCard"){
            copyMatch["playerMatches"][index][name] = !copyMatch["playerMatches"][index][name];
        } else {
            copyMatch["playerMatches"][index][name] = value;
        }
        setMatch(copyMatch);
    };

    const handleSubmit = async () => {
        let playerMatch = JSON.parse(JSON.stringify(match["playerMatches"]));
        const post = {
            player: playerMatch,
            goalA: match.homeTeamGoal,
            goalB: match.visitorTeamGoal,
        }
        try {
            await MatcheAPI.postEncodeMatch(post);
            toast.success("Les statistiques ont bien été enregistrées");
        }catch (e) {
            toast.error("Les statistiques n'ont pas été enregistrées");
        }

    }

    const handleChangeScore = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setMatch({ ...match, [name]: value });
    }

    useEffect( () => {
        fetchMatch();
    }, [id]);


    if (typeof match.id != 'undefined'){
        return(
            <>
                <button onClick={() =>  window.history.back()} className={"btn btn-danger mr-3 mb-5"}><i className="fas fa-arrow-left"/></button>
                <h3>{match.homeTeam.club.name} - {match.visitorTeam.club.name} </h3>
                {typeof match.homeTeamGoal != "undefined" && typeof match.visitorTeamGoal &&
                    <div className={"d-flex"}>
                        <div>
                            <h4 className={"mt-5"}>Score</h4>
                        </div>
                        <div className="col-1 mt-3">
                            <Field type={"number"} value={match.homeTeamGoal} name={"homeTeamGoal"} onChange={handleChangeScore}/>
                        </div>
                        <div className="col-1 mt-3">
                            <Field type={"number"} value={match.visitorTeamGoal} name={"visitoTeamGoal"} onChange={handleChangeScore}/>
                        </div>
                    </div>
                }
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
                                <input type={"number"} className={"form-control"}  min={0}  max={2} name={"yellowCard"} id={"yellowCard"+index}
                                       value={playerMatch["yellowCard"] || 0} onChange={handleChange} disabled={!playerMatch.played}/>
                            </td>
                            <td className={"col-2"}>
                                <div className={"custom-control custom-checkbox"}>
                                    <input type="checkbox" className="custom-control-input" id={"redCard"+index}  name={"redCard"} checked={playerMatch["redCard"] || false} onChange={handleChange}  disabled={!playerMatch.played}/>
                                    <label className="custom-control-label" htmlFor={"redCard"+index}></label>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={handleSubmit} className="btn btn-warning float-right">Enregistrer</button>
            </>
        )
    } else {
        return (<></>);
    }
}

export default EncodeMatchPage;