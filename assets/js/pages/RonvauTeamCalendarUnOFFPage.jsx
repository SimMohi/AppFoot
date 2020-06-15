import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import DateFunctions from "../services/DateFunctions";
import Field from "../components/forms/Fields";
import {toast} from "react-toastify";
import authAPI from "../services/authAPI";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import ClubsAPI from "../services/ClubsAPI";
import ReactSearchBox from "react-search-box";

const RonvauTeamCalendarUnOffPage = props => {

    const {id} = props.match.params;
    const isAdmin = authAPI.getIsAdmin();
    const [matchTeamRonvau, setMatchTeamRonvau] = useState([]);
    const [show, setShow] = useState([false, false, false, false]);
    const [editMatch, setEditMatch] = useState({
        id: "",
        date: "",
        hour: "20:00",
    });
    const [clubs, setClubs] = useState([]);
    const [selectClub, setSelectClub] = useState({});
    const [newMatch, setNewMatch] = useState({
        isHome: true,
        date: DateFunctions.todayFormatYMD(),
        time: "20:00"
    })
    const [convocP, setConvocP] = useState([]);
    const [name, setName] = useState("");

    const [players, setPlayers] = useState([]);

    const handleShow = (i) => {
        let copy = JSON.parse(JSON.stringify(show));
        copy[i] = true;
        setShow(copy);
    }

    const handleClose = (i) => {
        let copy = JSON.parse(JSON.stringify(show));
        copy[i] = false;
        setShow(copy);
    }

    const fetchMatch = async () => {
        const response = await MatcheAPI.getUnOfMatchCompet(id);
        setName(response["name"]);
        response["matchs"].sort(DateFunctions.orderByDate);
        setMatchTeamRonvau(response['matchs']);
    }

    const editMatchDate =  (match) => {
        let copy = JSON.parse(JSON.stringify(editMatch));
        copy["id"] = match.id;
        if (match.date !== null){
            copy["date"] = DateFunctions.dateFormatYMD(match.date);
            copy["hour"] = DateFunctions.getHoursHM(match.date);
        }
        setEditMatch(copy);
        handleShow(0);
    }

    const handleChangeDate = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setEditMatch({...editMatch, [name]: value});
    }

    const submitDateMatch = async () =>{
        if (editMatch.date == ""){
            toast.error("Date non valide");
            return ;
        }
        try{
            await MatcheAPI.editDateUnOffMatch(editMatch);
            toast.success("La date du match a bien été encodée");
        }catch (e) {
            toast.error("La date du match n'a pas pu être encodée");
        }
        handleClose(0);
        fetchMatch();
    }


    const detailsMatch =  async (a) => {
        try {
            const response = await MatcheAPI.getUnOfMatchDetails(a.id);
            setPlayers(response);
        }catch (e) {
            console.log(e);
        }
        handleShow(1);
    }

    const addNonOffMatch = () => {
        fetchClubs();
        handleShow(2);
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
        copy["teamRonvau"] = id ;
        copy["opponent"] = selectClub.key;
        try {
            await UnOfficialMatchAPI.create(copy);
            toast.success("Match encodés avec succès");
        } catch (e) {
            toast.error("Erreur lors de l'encodage du match");
        }
        handleClose(2);
        fetchMatch();

    }

    const convoc = async (idMatch) => {
        const response = await UnOfficialMatchAPI.calledPlayerUnOffMatch(idMatch);
        setConvocP(response);
        handleShow(3);
    }


    const fetchClubs = async () => {
        try {
            const response = await ClubsAPI.findAll();
            let clubArray = [];
            for (let i = 0; i < response.length; i++) {
                let club = {
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
        fetchMatch();
    }, []);

    return(
        <>
            <div className="d-flex">
                <Link to={"/equipeRonvau/"+ id+ "/matchCalendar"} className={"btn btn-danger mr-3 mb-5"}><i className="fas fa-arrow-left"/></Link>
                <div className={" ml-auto"}>
                    {isAdmin &&<button onClick={() => addNonOffMatch()} className="btn  btn-outline-danger">Ajouter un match hors Championnat</button>}
                </div>
            </div>
            <h3 className={"text-center"}>{name}</h3>
            <table className="mt-5 table table-hover text-center whiteBorder">
                <thead className={""}>
                <tr className={"row ml-3 mr-3"}>
                    <th className={"col-2"}>Date</th>
                    <th className={"col-3"}>Domicile</th>
                    <th className={"col-3"}>Extérieur</th>
                    <th className={"col-2"}>Score</th>
                    <th className={"col-2"}></th>
                </tr>
                </thead>
                <tbody>
                {matchTeamRonvau.map((mtr, index) =>
                    <tr key={index} className={"row ml-3 mr-3"}>
                        {mtr.date != null &&
                        <td className={"col-2"}>{DateFunctions.dateFormatFrDM(mtr.date)} &nbsp;
                            {mtr.date != null &&
                                DateFunctions.getHoursHMV2(mtr.date, 1)
                            }
                        </td>
                        || <td className={'col-1'}>Non défini</td>
                        }
                        <td className={"col-3"}>{mtr["teamA"]}</td>
                        <td className={"col-3"}>{mtr["teamB"]}</td>
                        <td className={"col-2"}>{mtr.isOver && (mtr["teamAGoal"]+"-"+mtr["teamBGoal"])
                        || isAdmin &&
                        <>
                            {/*<button onClick={() => editMatchDate(mtr)}*/}
                            {/*        className="btn btn-sm btn-danger">Date du match*/}
                            {/*</button>*/}
                            {/*<Link to={"/unOffMatch/"+mtr.id+"/select"} className={"btn btn-sm btn-warning mr-3"}>Convocations</Link>*/}
                            -
                        </>
                        ||
                        ""
                        }
                        </td>
                        {isAdmin &&
                        <td className={"col-2"}>
                            <Link to={"/unOffMatch/" + mtr.id + "/encode"}
                                  className={"btn btn-sm btn-warning"}>Encodage</Link>
                        </td>
                        ||
                        mtr.isOver &&
                        <td className={"col-2"}>
                            <button onClick={() => detailsMatch(mtr)}
                                    className="btn btn-sm btn-warning">Détails
                            </button>
                        </td>
                            ||
                        <td className={"col-2"}>
                            <button onClick={() => convoc(mtr.id)}
                                    className="btn btn-sm btn-warning">Liste des convoqués
                            </button>
                        </td>
                        }
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show[0]} onHide={() => handleClose(0)}>
                <Modal.Header closeButton>
                    Encoder la date et l'heure du match
                </Modal.Header>
                <Modal.Body className={""}>
                    <Field name={"date"} label={"Date du match"} min={DateFunctions.addYears(-1)} max={DateFunctions.addYears(3)} type={"date"} value={editMatch.date} onChange={handleChangeDate} />
                    <Field name={"hour"} label={"Heure du match"} type={"time"} value={editMatch.hour} onChange={handleChangeDate} />
                    <button onClick={submitDateMatch} className="btn btn-danger">Enregistrer</button>
                </Modal.Body>
            </Modal>
            <Modal show={show[1]} onHide={() => handleClose(1)}>
                <Modal.Header closeButton>
                    Détails du match
                </Modal.Header>
                <Modal.Body className={""}>
                    <div className="row">
                        <div className={"col-6"}>
                            <h6>Joueurs</h6>
                            {players.map((play, index) =>
                                <div key={index}>{play.name}</div>
                            )}
                        </div>
                        <div className="col-6">
                            <h6>Goals</h6>
                            {players.map((play, index) =>
                                play["goal"] > 0 &&
                                <div key={index}>{play.name}</div>
                            )}
                            <h6 className={"mt-3"}>Cartons Jaunes</h6>
                            {players.map((play, index) =>
                                play["yellow"] > 0 &&
                                <div key={index}>{play.name}</div>
                            )}
                            <h6 className={"mt-3"}>Cartons Rouges</h6>
                            {players.map((play, index) =>
                                play["red"] > 0 &&
                                <div key={index}>{play.name}</div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={show[2]} onHide={() => handleClose(2)}>
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
                    <button onClick={() => createMatch()} className="btn btn-danger float-right">Valider</button>
                </Modal.Body>
            </Modal>
            <Modal show={show[3]} onHide={() => handleClose(3)}>
                <Modal.Header closeButton>
                    Liste des convoqués pour ce match
                </Modal.Header>
                <Modal.Body className={""}>
                    {convocP.map((p, index) =>
                        <p key={index}>{p}</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RonvauTeamCalendarUnOffPage;