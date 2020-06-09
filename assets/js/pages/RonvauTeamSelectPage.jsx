import React, {useState} from 'react';
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";
import Modal from "react-bootstrap/Modal";
import TeamsAPI from "../services/TeamsAPI";
import ReactSearchBox from "react-search-box";
import Field from "../components/forms/Fields";
import DateFunctions from "../services/DateFunctions";
import {toast} from "react-toastify";
import {UNOFFICIAL_MATCH_API} from "../config";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import authAPI from "../services/authAPI";

const RonvauTeamSelectPage = props => {
    const {id} = props.match.params;
    const isAdmin = authAPI.getIsAdmin();
    const [clubs, setClubs] = useState([]);
    const [show, setShow] = useState(false);
    const [selectClub, setSelectClub] = useState({});
    const [newMatch, setNewMatch] = useState({
        isHome: true,
        date: DateFunctions.todayFormatYMD(),
        time: "20:00"
    })

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
        delete copy.time;
        try {
            await UnOfficialMatchAPI.create(copy);
            toast.success("Match encodés avec succès");
        } catch (e) {
            toast.error("Erreur lors de l'encodage du match");
        }
    }

    return(
        <>
            <Link to={"/equipeRonvau/"+id+"/matchCalendar"} className={"btn btn-sm btn-warning mr-3"}>Calendrier des matchs</Link>
            <Link to={"/equipeRonvau/"+id+"/user"} className={"btn btn-sm btn-warning mr-3"}>Membres de l'équipe</Link>
            {isAdmin &&<button onClick={() => addNonOffMatch()} className="btn btn-sm btn-primary">Ajouter un match hors Championnat</button>}
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

export default RonvauTeamSelectPage;