import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {toast} from "react-toastify";
import PlayerMatchAPI from "../services/PlayerMatchAPI";
const SelectPlayerMatchPage = props => {

    const {id} = props.match.params;
    const [notCall, setNotCall] = useState([]);
    const [call, setCall] = useState([]);
    const [reload, setReload] = useState(0);

    const fetchMatch = async () => {
        const responseMatch = await MatcheAPI.find(id);
        let newUsers = [];
        if (!typeof responseMatch["homeTeam"]["teamRonvau"] == 'undefined'){
            let idRT = responseMatch["homeTeam"]["teamRonvau"]["id"];
            const responseUser = await RonvauTeamAPI.find(idRT);
            newUsers = responseUser["userTeams"];
        } else {
            let idRT = responseMatch["visitorTeam"]["teamRonvau"]["id"];
            const responseUser = await RonvauTeamAPI.find(idRT);
            newUsers = responseUser["userTeams"];
        }
        let copyNewUsers = JSON.parse(JSON.stringify(newUsers));
        let callArray = [];
        let notCallArray = [];
        for (let i = 0; i < copyNewUsers.length; i++){
            let inArray = 0;
            for (let j = 0; j < responseMatch["playerMatches"].length; j++){
                if (copyNewUsers[i]["@id"] == responseMatch["playerMatches"][j]["idUserTeam"]){
                    let response = responseMatch["playerMatches"][j];
                    response["userId"] = copyNewUsers[i]["userId"];
                    response["called"] = false;
                    callArray.push(response);
                    inArray = 1;
                }
            }

            if(inArray == 0){
                copyNewUsers[i]["called"] = false;
                notCallArray.push(copyNewUsers[i]);
            }
        }
        setCall(callArray);
        setNotCall(notCallArray);
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
            await MatcheAPI.postCallMatch(post);
        }catch (e) {
            toast.error("Les joueurs n'ont pas réussi à être convoqués");
        }
        setReload(reload+1);
    }

    const handleDelete = async (id) => {
        try {
            await PlayerMatchAPI.deletePlayerMatch(id)
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
                                    <td className="col-6">{user.userId.lastName + " " + user.userId.firstName}</td>
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
                        <table className="mt-5 table table-hover text-center">
                            <thead>
                            <tr className={"row"}>
                                <th className={"col-4"}>Nom</th>
                                <th className={"col-4"}>A accepté ?</th>
                                <th className={"col-4"}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {call.map((user) =>
                                <tr className={"row"} key={user.id}>
                                    <td className="col-4">{user.userId.lastName + " " + user.userId.firstName}</td>
                                    <td className="custom-control custom-checkbox col-4">
                                        {user["hasConfirmed"] == true &&
                                            <i className="fas fa-check"></i> || <i className="fas fa-times"></i>
                                        }
                                    </td>
                                    <td className="col-4">
                                        <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Supprimer</button>
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

export default SelectPlayerMatchPage;