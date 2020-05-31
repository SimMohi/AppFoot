import React, {useEffect, useState} from 'react';
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import usersAPI from "../services/usersAPI";
import {Link} from "react-router-dom";

const RonvauTeamMemberUser = props => {

    const {id} = props.match.params;

    const [ronvauTeam, setRonvauTeam] = useState({
        coachs: [],
        players: [],
        supporters: [],
        category: ""
    });

    const fetchRonvauTeam = async () => {
        try {
            const {userTeams, category} = await RonvauTeamAPI.find(id);
            let coachs = [];
            let players = [];
            let supporters = [];
            for (let i = 0; i < userTeams.length; i++){
                if (userTeams[i]["isStaff"]){
                    coachs.push(userTeams[i]["userId"]);
                }
                if (userTeams[i]["isPlayer"]){
                    players.push(userTeams[i]["userId"]);
                }
                if (!userTeams[i]["isPlayer"] && !userTeams[i]["isStaff"]){
                    supporters.push(userTeams[i]["userId"]);
                }
            }
            setRonvauTeam({coachs, players, supporters,  category});
        } catch (error) {
            console.log(error.response);
        }
    };

    console.log(ronvauTeam);

    useEffect( () => {
        fetchRonvauTeam();
    }, []);

    return(
        <>
            <h3>Membres de l'équipe : {ronvauTeam.category}</h3>
            <div className="row m-5">
                <div className={"col-4"}>
                    <h5 className={"p-4"}>Coachs</h5>
                    {ronvauTeam.coachs.map((user, index) =>
                        <div key={index}>
                            <Link to={"/profil/"+user.id} className={"nav-link"}>{user.firstName + " " + user.lastName}</Link>
                        </div>
                    )}
                </div>
                <div className={"col-4"}>
                    <h5 className={"p-4"}>joueurs</h5>
                    {ronvauTeam.players.map((user, index) =>
                        <div key={index}>
                            <Link to={"/profil/"+user.id} className={"nav-link"}>{user.firstName + " " + user.lastName}</Link>
                        </div>
                    )}
                </div>
                <div className={"col-4"}>
                    <h5>Supporters</h5>
                    {ronvauTeam.supporters.map((user, index) =>
                        <div key={index}>
                            <Link to={"/profil/"+user.id} className={"nav-link"}>{user.firstName + " " + user.lastName}</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default RonvauTeamMemberUser;