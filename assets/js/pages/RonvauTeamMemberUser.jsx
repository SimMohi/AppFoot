import React, {useEffect, useState} from 'react';
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import usersAPI from "../services/usersAPI";
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";
import Modal from "react-bootstrap/Modal";
import ReactSearchBox from "react-search-box";
import Field from "../components/forms/Fields";
import {toast} from "react-toastify";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import authAPI from "../services/authAPI";
import DateFunctions from "../services/DateFunctions";

const RonvauTeamMemberUser = props => {

    const {id} = props.match.params;
    const isAdmin = authAPI.getIsAdmin();
    const [clubs, setClubs] = useState([]);
    const [selectClub, setSelectClub] = useState({});
    const [newMatch, setNewMatch] = useState({
        isHome: true,
        date: DateFunctions.todayFormatYMD(),
        time: "20:00"
    })
    const [show, setShow] = useState(false);
    const [ronvauTeam, setRonvauTeam] = useState({
        coachs: [],
        players: [],
        supporters: [],
        category: ""
    });

    const fetchRonvauTeam = async () => {
        try {
            const response= await RonvauTeamAPI.getTeamMember(id);
            setRonvauTeam(response);
        } catch (error) {
            console.log(error.response);
        }
    };

    const addNonOffMatch = () => {
        fetchClubs();
        setShow(true);
    }

    const handleChangeNewMatch = ({currentTarget}) => {
        const { name, value } = currentTarget;
        if (name == "isHome"){
            setNewMatch({...newMatch, ["isHome"]: !newMatch.isHome});
        } else {
            setNewMatch({...newMatch, [name]: value});
        }
    }

    const createMatch = async () => {
        if (Object.keys(selectClub).length === 0 && selectClub.constructor === Object){
            toast.warn("Pas d'équipe adverse");
            return ;
        }
        let copy = JSON.parse(JSON.stringify(newMatch));
        copy["teamRonvau"] = "api/team_ronvaus/" + id ;
        copy["opponent"] = "/api/clubs/" + selectClub.key;
        copy["date"] = new Date(copy.date+ " " + copy.time);
        console.log(copy.date);
        delete copy.time;
        try {
            await UnOfficialMatchAPI.create(copy);
            toast.success("Match encodés avec succès");
        } catch (e) {
            toast.error("Erreur lors de l'encodage du match");
        }
        setShow(false);
    }

    const fetchClubs = async () => {
        try{
            const response = await ClubsAPI.findAll();
            let clubArray = [];
            for (let i = 0; i < response.length; i++){
                let club =  {
                    "key": response[i].id,
                    "value": response[i].name
                }
                clubArray.push(club);
            }
            setClubs(clubArray);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect( () => {
        fetchRonvauTeam();
    }, []);

    return(
        <>
            <Link to={"/equipeRonvau/"} className={"btn btn-info mr-3 mb-5"}>Retour</Link>
            <div className="row">
                <div className="col-8">
                    <h3>Membres de l'équipe : {ronvauTeam.category}</h3>
                </div>
                <div className="col-4 d-flex align-items-end flex-column">
                    <Link to={"/equipeRonvau/"+id+"/matchCalendar"} className={"btn btn-warning mr-3"}>Calendrier des matchs</Link><br/>
                </div>
            </div>
            <h5 className={"mt-5"}>Coachs</h5>
            <table className="table table-hover text-center">
                <thead>
                <tr className={"row"}>
                    <th className={"col-4"}>Nom</th>
                    <th className={"col-2"}>Adresse email</th>
                    <th className={"col-2"}>Telephone</th>
                </tr>
                </thead>
                <tbody>
                {ronvauTeam.coachs.map((p, index) =>
                    <tr key={index} className={"row"}>
                        <td className={"col-4"}>
                            <Link to={"/profil/"+p.id} className={"nav-link"}>{p.name}</Link>
                        </td>
                        <td className={"col-2"}>{p.email}</td>
                        <td className={"col-2"}>{p.tel}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <h5 className={"mt-5"}>Joueurs</h5>
            <table className="table table-hover text-center">
                <thead>
                <tr className={"row"}>
                    <th className={"col-4"}>Nom</th>
                    <th className={"col-2"}>Matchs joués</th>
                    <th className={"col-1"}><img src="img/Ball.png" alt="goal" className={"imgEncode"}/></th>
                    <th className={"col-1"}><img src="img/Carton_jaune.png" alt="jaune" className={"imgEncode"}/></th>
                    <th className={"col-1"}><img src="img/Carton_rouge.png" alt="rouge" className={"imgEncode"}/></th>
                    <th className={"col-2"}>Entrainements</th>
                </tr>
                </thead>
                <tbody>
                {ronvauTeam.players.map((p, index) =>
                    <tr key={index} className={"row"}>
                        <td className={"col-4"}>
                            <Link to={"/profil/"+p.id} className={"nav-link"}>{p.name}</Link>
                        </td>
                        <td className={"col-2"}>{p.play}</td>
                        <td className={"col-1"}>{p.goal}</td>
                        <td className={"col-1"}>{p.yellow}</td>
                        <td className={"col-1"}>{p.red}</td>
                        <td className={"col-2"}>{p.train}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Programmer un match
                </Modal.Header>
                <Modal.Body className={""}>
                    <div className="mb-3">
                        <ReactSearchBox
                            placeholder="Club adverse"
                            data={clubs}
                            onSelect={record => setSelectClub(record)}
                            onFocus={() => {
                            }}
                            onChange={() => {
                            }}
                            fuseConfigs={{
                                threshold: 0.05,
                            }}
                        />
                    </div>
                    <Field name={"date"} label={"Jour du match"} type={"date"} value={newMatch.date} onChange={handleChangeNewMatch}/>
                    <Field name={"time"} label={"heure du match"} type={"time"} value={newMatch.time} onChange={handleChangeNewMatch}/>
                    <div className={"custom-control custom-checkbox mb-3 mt-3"}>
                        <input type="checkbox" className="custom-control-input" name={"isHome"} id={"isHome"} checked={newMatch.isHome} onChange={handleChangeNewMatch}/>
                        <label className="custom-control-label" htmlFor={"isHome"}>Se joue à domicile</label>
                    </div>
                    <button onClick={() => createMatch()} className="btn btn-primary float-right">Valider</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RonvauTeamMemberUser;