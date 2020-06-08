import React, {useEffect, useState} from 'react';
import PlayerMatchAPI from "../services/PlayerMatchAPI";
import MatcheAPI from "../services/MatcheAPI";
import Field from "../components/forms/Fields";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import {toast} from "react-toastify";

const EncodeUnOffMatchPage = props => {

    const {id} = props.match.params;
    const [match, setMatch] = useState({
        called: [],
        ronvauGoal: 0,
        opponentGoal: 0
    });

    const fetchMatch = async () =>{
        try{
            const response = await UnOfficialMatchAPI.find(id);
            setMatch(response);

        } catch (e) {
            console.log(e.response);
        }
    }

    const changeCheckBoxPlay = ({ currentTarget }) => {
        const {id} = currentTarget;
        let index = id.replace("play","");
        let copyMatch = JSON.parse(JSON.stringify(match));
        if (copyMatch["called"][index]["played"] == true){
            copyMatch["called"][index]["played"] = false;
        } else {
            copyMatch["called"][index]["played"] = true
        }
        setMatch(copyMatch);
    }

    const changeCheckBoxRed = ({ currentTarget }) => {
        const {id} = currentTarget;
        let index = id.replace("red","");
        let copyMatch = JSON.parse(JSON.stringify(match));
        if (copyMatch["called"][index]["red"] == true){
            copyMatch["called"][index]["red"] = false;
        } else {
            copyMatch["called"][index]["red"] = true
        }
        setMatch(copyMatch);
    }

    const handleChangeScore = ({currentTarget}) => {
        const { name, value } = currentTarget;
        console.log(name, value);
        setMatch({...match, [name]: value});
    }

    const handleChange = ({ currentTarget }) => {
        const { name, value, id } = currentTarget;
        let index = id.replace(name,"");
        let copyMatch = JSON.parse(JSON.stringify(match));
        copyMatch["called"][index][name] = value;
        copyMatch["called"][index][name] = value;
        setMatch(copyMatch);
    };

    const handleSubmit = async () => {
        let playerMatch = JSON.parse(JSON.stringify(match["called"]));
        const post =  {
            players: playerMatch,
            idMatch: id,
            goalRonvau: match.ronvauGoal,
            opponentGoal: match.opponentGoal
        }
        try {
            console.log(post);
            await UnOfficialMatchAPI.postEncodeUnOffMatch(post);
            toast.success("Les statistiques ont bien été enregistrées");

        }catch (e) {
            toast.error("Les statistiques n'ont pas été enregistrées");
        }
    }


    useEffect( () => {
        fetchMatch();
    }, [id]);

     return(
            <>
                <button onClick={() =>  window.history.back()} className={"btn btn-info mr-3 mb-5"}>Retour</button>
                <h3>{match.name} </h3>
                <div className={"row"}>
                    <div className="col-1">
                        <h5 className={"mt-5"}>Score :</h5>
                    </div>
                    {match.home
                    &&
                    <>
                        <div className="col-1">
                            <Field name={"ronvauGoal"} type={"number"} value={match.ronvauGoal} onChange={handleChangeScore}/>
                        </div>
                        <div className="col-1">
                            <Field name={"opponentGoal"} type={"number"} value={match.opponentGoal} onChange={handleChangeScore}/>
                        </div>
                    </>
                    ||
                    <>
                        <div className="col-1">
                            <Field name={"number"} type={"number"} value={match.opponentGoal} onChange={handleChangeScore}/>
                        </div>
                        <div className="col-1">
                            <Field name={"number"} type={"number"} value={match.ronvauGoal} onChange={handleChangeScore}/>
                        </div>
                    </>
                    }
                </div>
                <h5 className={"mt-5"}>Encoder les statistiques des joueurs</h5>
                <table className="mt-5 table table-hover text-center ">
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
                    {match["called"].map((playerMatch, index) =>
                        <tr key={playerMatch.id} className={"row"}>
                            <td className={"col-4"}>{playerMatch.name}</td>
                            <td className={"custom-control custom-checkbox col-2"}>
                                <input type="checkbox" className="custom-control-input" id={"play"+index} onChange={changeCheckBoxPlay} checked={playerMatch.played}/>
                                <label className="custom-control-label" htmlFor={"play"+index}></label>
                            </td>
                            <td className={"col-2"}>
                                <input type={"number"} className={"form-control"}  min={0}  name={"goal"} id={"goal"+index}
                                       value={playerMatch["goal"] || 0} onChange={handleChange} disabled={!playerMatch.played}/>
                            </td>
                            <td className={"col-2"}>
                                <input type={"number"} className={"form-control"}  min={0}  max={2} name={"yellow"} id={"yellow"+index}
                                       value={playerMatch["yellow"] || 0} onChange={handleChange} disabled={!playerMatch.played}/>
                            </td>
                            <td className={"col-2"}>
                                <div className={"custom-control custom-checkbox"}>
                                    <input type="checkbox" className="custom-control-input" id={"red"+index}  name={"red"} checked={playerMatch["red"]} onChange={changeCheckBoxRed}  disabled={!playerMatch.played}/>
                                    <label className="custom-control-label" htmlFor={"red"+index}></label>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={handleSubmit} className="btn btn-success float-right">Enregistrer</button>
            </>
        )
}

export default EncodeUnOffMatchPage;