import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {toast} from "react-toastify";
import PlayerMatchAPI from "../services/PlayerMatchAPI";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";

const SelectPlayerUnOffMatchPage = props => {

    const {id} = props.match.params;
    const [match, setMatch] = useState({
        name: "",
        date: "",
        teamUser: [],
        cat: "",
        accepted: 0,
        total: 0
    })
    const [notCall, setNotCall] = useState([]);
    const [call, setCall] = useState([]);
    const [reload, setReload] = useState(0);
    const [answer, setAnswer] = useState({
        accepted: 0,
        total: 0
    })

    const fetchMatch = async () => {
        const responseMatch = await UnOfficialMatchAPI.find(id);
        console.log(responseMatch);
        setMatch(responseMatch);
        setNotCall(responseMatch["notCalled"]);
        setCall(responseMatch["called"]);
    }


    const changeCheckBoxNotCall = ({ currentTarget }) => {
        const {id} = currentTarget;
        let index = id.replace("notCall","");
        let copyUser = JSON.parse(JSON.stringify(notCall));
        if (copyUser[index]["called"] == true){
            copyUser[index]["called"] = false;
        } else {
            copyUser[index]["called"] = true
        }
        setNotCall(copyUser);
    }

    const callFunction = async () => {
        try{
            let post = {
                call: notCall,
                match: id
            }
            await UnOfficialMatchAPI.selectUnoff(post);
        }catch (e) {
            toast.error("Les joueurs n'ont pas réussi à être convoqués");
        }
        setReload(reload+1);
    }

    const handleDelete = async (user) => {
        let data = {
            idMatch: id,
            idUserTeam: user.idUserTeam
        }
        try {
            await UnOfficialMatchAPI.delUnOffPl(data);
        } catch (e) {
            toast.error("L'entraînement n'a pas été supprimé");
        }
        setReload(reload+1);
    }


    useEffect( () => {
        fetchMatch();
    }, [reload]);

    return(
        <>
            <h3 className={"mb-5"}>Convocations pour le macth {match.name}</h3>
            <div className="container">
                <div className="row">
                    <div className="col-5">
                        <table className="mt-5 table table-hover text-center">
                            <thead>
                            <tr className={"row"}>
                                <th className={"col-6"}>Nom</th>
                                <th className={"col-6"}>Convoquer</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notCall.map((user, index) =>
                                <tr className={"row"} key={user.id}>
                                    <td className="col-6">{user.name}</td>
                                    <td className="custom-control custom-checkbox col-6">
                                        <input type="checkbox" className="custom-control-input" id={"notCall"+index} onChange={changeCheckBoxNotCall} checked={user.called}/>
                                        <label className="custom-control-label" htmlFor={"notCall"+index}></label>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <button onClick={callFunction} className="btn btn-primary">Convoquer</button>
                    </div>
                    <div className="col-2"></div>
                    <div className="col-5">
                        <div>{match.accepted+" réponses positive sur "+match.total}</div>
                        <table className="mt-5 table table-hover text-center">
                            <thead>
                            <tr className={"row"}>
                                <th className={"col-4"}>Nom</th>
                                <th className={"col-4"}>Réponse</th>
                                <th className={"col-4"}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {call.map((user) =>
                                <tr className={"row"} key={user.id}>
                                    <td className="col-4">{user.name}</td>
                                    <td className="custom-control custom-checkbox col-4">
                                        {user["hasComfirmed"] == true &&
                                        <i className="fas fa-check"></i>
                                        }
                                        {user["hasRefused"] == true &&
                                        <i className="fas fa-times"></i>
                                        }
                                        {(user["hasRefused"] == false && user["hasComfirmed"] == false) &&
                                        <i className="far fa-clock"></i>
                                        }
                                    </td>
                                    <td className="col-4">
                                        <button onClick={() => handleDelete(user)} className="btn btn-sm btn-danger">Supprimer</button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectPlayerUnOffMatchPage;