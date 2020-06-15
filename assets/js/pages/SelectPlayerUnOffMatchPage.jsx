import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {toast} from "react-toastify";
import PlayerMatchAPI from "../services/PlayerMatchAPI";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import Field from "../components/forms/Fields";
import DateFunctions from "../services/DateFunctions";

const SelectPlayerUnOffMatchPage = props => {

    const {id} = props.match.params;
    const [match, setMatch] = useState({
        name: "",
        date: "",
        teamUser: [],
        cat: "",
        accepted: 0,
        total: 0,
        appointment: ""
    })
    const [notCall, setNotCall] = useState([]);
    const [call, setCall] = useState([]);
    const [reload, setReload] = useState(0);
    const [answer, setAnswer] = useState({
        accepted: 0,
        total: 0
    })

    const fetchMatch = async () => {
        const response = await UnOfficialMatchAPI.find(id);
        let responseMatch = JSON.parse(JSON.stringify(response));
        if (responseMatch["appointment"] == null){
            responseMatch["appointment"] = "18:00";
        } else {
            responseMatch["appointment"] = DateFunctions.getHoursHM(responseMatch["appointment"], 2);
        }
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
                match: id,
                appointment: match.appointment,
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

    const handleChange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setMatch({...match, [name]: value});
    }


    useEffect( () => {
        fetchMatch();
    }, [reload]);

    return(
        <>
            <button onClick={() =>  window.history.back()} className={"btn btn-danger mr-3 mb-5"}><i className="fas fa-arrow-left"/></button>
            <h3 className={"mb-5"}>Convocations pour le macth {match.name}</h3>
            <div className="d-flex mb-5">
                <h6 className={"mt-5"}>Heure de rendez-vous sur place : </h6>
                <div className="col-2 mt-2">
                    <Field type={"time"} name={"appointment"} value={match.appointment} onChange={handleChange}/>
                </div>
            </div>

            <div className="">
                <div className="row">
                    <div className="col-4 ">
                        <table className="mt-5 table table-hover text-center whiteBorder p-3">
                            <thead>
                            <tr className={"row ml-3 mr-3 "}>
                                <th className={"col-6"}>Nom</th>
                                <th className={"col-6"}>Convoquer</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notCall.map((user, index) =>
                                <tr className={"row ml-3 mr-3 "} key={user.id}>
                                    <td className="col-6">{user.name}</td>
                                    <td className="custom-control custom-checkbox col-6">
                                        <input type="checkbox" className="custom-control-input" id={"notCall"+index} onChange={changeCheckBoxNotCall} checked={user.called}/>
                                        <label className="custom-control-label" htmlFor={"notCall"+index}></label>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <button onClick={callFunction} className="btn btn-danger">Convoquer</button>
                    </div>
                    <div className="col-8">
                        <div className="">
                            <div>{match.accepted+" réponses positive sur "+match.total}</div>
                            <table className="mt-5 table table-hover text-center whiteBorder p-3">
                                <thead>
                                <tr className={"row"}>
                                    <th className={"col-3"}>Nom</th>
                                    <th className={"col-1"}>Réponse</th>
                                    <th className={"col-6"}>Justification</th>
                                    <th className={"col-2"}></th>
                                </tr>
                                </thead>
                                <tbody>
                                {call.map((user) =>
                                    <tr className={"row"} key={user.id}>
                                        <td className="col-3">{user.name}</td>
                                        <td className="custom-control custom-checkbox col-1">
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
                                        <td className="col-6">
                                            {user["refusedJustification"]}
                                        </td>
                                        <td className="col-2">
                                            <button onClick={() => handleDelete(user)} className="btn btn-sm btn-danger">Annuler</button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectPlayerUnOffMatchPage;