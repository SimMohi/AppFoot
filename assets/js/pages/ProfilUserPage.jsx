import React, {useEffect, useState} from 'react';
import axios from "axios";
import Field from "../components/forms/Fields";
import ReactSearchBox from "react-search-box";
import {API_URL, USERS_API} from "../config";

const ProfilUserPage = props => {

    const {id} = props.match.params;
    const [user, setUser] = useState({
        lastName: "",
        firstName: "",
        email: "",
        gsm: ""
    });
    const [allUsers, setAllUSers] = useState([]);
    const [info, setInfo] = useState([]);

    const fetchUser = async () => {
        axios.all([
            axios.get(API_URL + "/profile/" + id),
            axios.get(USERS_API)
        ]).then(axios.spread( (...responses) => {
            const usersResponse = responses[1]["data"]["hydra:member"];
            let allUsersArray = [];
            for (let i = 0; i < usersResponse.length; i++){
                if (usersResponse[i].id == id){
                    const {lastName, firstName, email, gsm} = usersResponse[i];
                    setUser({ lastName, firstName, email, gsm});
                } else {
                    let user =  {
                        "key": usersResponse[i].id,
                        "value": usersResponse[i].firstName + " " + usersResponse[i].lastName,
                    }
                    allUsersArray.push(user);
                }
            }
            setAllUSers(allUsersArray);
            if (typeof  responses[0]["data"]["infos"] != 'undefined'){
                setInfo(responses[0]["data"]["infos"]);
            }
        })).catch(errors => {
            console.log(errors.response);
        })
    }

    const goToProfile = (id) => {
        props.history.replace("/profil/" + id);
    }

    useEffect( () => {
        fetchUser();
    }, [id]);


    return(
        <>

            <div className="container">
                <div className="row">
                    <div className="col-4 whiteBorder p-3">
                        <h5>{user.firstName + " " + user.lastName}</h5>
                        <p>{user.email}</p>
                        <p>{user.gsm}</p>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <ReactSearchBox
                            placeholder="Rechercher quelqu'un"
                            data={allUsers}
                            onSelect={record => goToProfile(record["key"])}
                            onFocus={() => {
                            }}
                            onChange={() => {
                            }}
                            fuseConfigs={{
                                threshold: 0.05,
                            }}
                        />
                    </div>
                </div>
            </div>
            <h5 className={"mt-5"}>Ces statistiques</h5>
            <table className="table table-hover mt-5 text-center container whiteBorder">
                <thead>
                <tr className={"row ml-3 mr-3"}>
                    <th className={"col-4"}>Equipe</th>
                    <th className={"col-2"}>Matchs joués</th>
                    <th className={"col-2"}><img src="img/Ball.png" alt="goal" className={"imgEncode"}/></th>
                    <th className={"col-2"}><img src="img/Carton_jaune.png" alt="jaune" className={"imgEncode"}/></th>
                    <th className={"col-2"}><img src="img/Carton_rouge.png" alt="rouge" className={"imgEncode"}/></th>
                </tr>
                </thead>
                <tbody>
                {info.map((team, index) =>
                    <tr key={index} className={"row ml-3 mr-3"}>
                        <td className={"col-4"}>{team.team}</td>
                        <td className={"col-2"}>{team.played}</td>
                        <td className={"col-2"}>{team.goal}</td>
                        <td className={"col-2"}>{team.yellowCard}</td>
                        <td className={"col-2"}>{team.redCard}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}

export default ProfilUserPage;