import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import TeamsAPI from "../services/TeamsAPI";
import MatcheAPI from "../services/MatcheAPI";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import Field from "../components/forms/Fields";
import ReactSearchBox from "react-search-box";
import Modal from "react-bootstrap/Modal";
import DateFunctions from "../services/DateFunctions";

const MatchPages = props => {

    const {id} = props.match.params;
    const [show, setShow] = useState([false, false]);
    const [reload, setReload] = useState(0);
    const [allMatchs, setAllMatchs] = useState([]);
    const [matchDayNumber, setMatchDayNumber] = useState(0);
    const [selectedMatchDay, setSelectedMatchDay] = useState(1);
    const [matchOfDay, setMatchOfDay] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [newMatch, setNewMatch] = useState({
        a: "",
        b: "",
        idCompet : id,
        hour: "19:00",
        date: DateFunctions.todayFormatYMD(),
    })

    const [editMatch, setEditMatch] = useState({
        id: "",
        teamA: "",
        teamB: "",
        hour: "19:00",
        date: DateFunctions.todayFormatYMD(),
        goalA: 0,
        goalB: 0,
    })

    const handleShow = (i) => {
        let showCopy = [...show];
        showCopy[i] = true;
        setShow(showCopy);
    }

    const handleClose = (i) => {
        let showCopy = [...show];
        showCopy[i] = false;
        setShow(showCopy);
    }

    const FindMatchDayNumber = async () => {
        const compet = await CompetitionsAPI.find(id);
        let numberDay = 2 * (compet.teams.length -1);
        setMatchDayNumber(numberDay);
    }

    const changeMatchDay = ({ currentTarget }) => {
        const i = (currentTarget.value);
        let copy = JSON.parse(JSON.stringify(allMatchs));
        for (let j = 0; j < copy[i].length; j++){
            if (copy[i][j]["homeTeamGoal"] !== null ){
                copy[i][j]["originalHomeTeamGoal"] = copy[i][j]["homeTeamGoal"];
            } else {
                copy[i][j]["originalHomeTeamGoal"] = null;
            }
            if (copy[i][j]["visitorTeamGoal"] !== null ){
                copy[i][j]["originalVisitorTeamGoal"] = copy[i][j]["visitorTeamGoal"];
            } else {
                copy[i][j]["originalVisitorTeamGoal"] = null;
            }
        }
        setMatchOfDay(copy[i]);
        setSelectedMatchDay(currentTarget.value);
    }

    const findMatches = async () => {
        const match = await MatcheAPI.findCompetMatchDay(id);
        setAllMatchs(match);
        setMatchOfDay(match[selectedMatchDay]);
    }

    const FindTeams = async () => {
        try {
            const data = await TeamsAPI.findCompet(id);
            let clubsArr= [];
            for (let i = 0; i < data.length; i++){
                let club =  {
                    "key": data[i]["club"].id,
                    "value":  data[i]["club"].name,
                }
                clubsArr.push(club);
            }
            setClubs(clubsArr);
        } catch (error) {
            console.log(error.response);
        }
    }

    const setSelectClubA = (id) => {
        let copy = JSON.parse(JSON.stringify(newMatch));
        copy["a"] = id;
        setNewMatch(copy);
    }

    const setSelectClubB = (id) => {
        let copy = JSON.parse(JSON.stringify(newMatch));
        copy["b"] = id;
        setNewMatch(copy);
    }

    const addMatch = async () => {
        let copy = JSON.parse(JSON.stringify(newMatch));
        copy["matchDay"] = selectedMatchDay;
        copy["date"] = new Date(copy.date+ " "+ copy.hour);
        try{
            await MatcheAPI.newMatch(copy);
            toast.success("Match enregistré");
        } catch (e) {
            toast.error("Erreur lors de l'enregistrement du match");
        }
        setReload(reload+1);
    }

    const createOptions = (matchDayNumber) => {
        let options = [];
        for (let i = 1; i < matchDayNumber+1; i++) {
            options.push(<option key={i} value={i}>Journée {i}</option>)
        }
        return options
    }

    const handleChangeGoalA = ({currentTarget}) => {
        let copy = JSON.parse(JSON.stringify(matchOfDay));
        copy[currentTarget.name]["homeTeamGoal"] = currentTarget.value;
        setMatchOfDay(copy);
    }

    const handleChangeGoalB = ({currentTarget}) => {
        let copy = JSON.parse(JSON.stringify(matchOfDay));
        copy[currentTarget.name]["visitorTeamGoal"] = currentTarget.value;
        setMatchOfDay(copy);
    }

    const handleSubmit = async () => {
        try{
            MatcheAPI.scoreMatch(matchOfDay);
            toast.success("Matchs enregistrés avec succès");
        } catch (e) {
            toast.error("Erreur lors de l'enregistrement des matchs");
        }
        setReload(reload+1);
    }

    const openModal = (match) => {
        let date = DateFunctions.dateFormatYMD(match.date);
        let hour = DateFunctions.getHoursHM(match.date, 1);
        setEditMatch({
            id: match.id,
            date: date,
            hour: hour,
        })
        handleShow(0);
    }

    const handleChangeDate = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setEditMatch({...editMatch, [name]: value});
    }

    const handleChangeNewTeam = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setNewMatch({...newMatch, [name]: value});
    };

    const submitDateMatch = async ()=> {
        const data = {
            id: editMatch.id,
            date: new Date(editMatch.date + " "+ editMatch.hour),
        }
        await MatcheAPI.newDateMatch(data);
        handleClose(0);
        setReload(reload+1);
    }

    const modalScore = (match) => {
        setEditMatch({
            teamA: match.homeTeam.club.name,
            teamB: match.visitorTeam.club.name,
            id: match.id,
            goalA: match.homeTeamGoal,
            goalB: match.visitorTeamGoal
        })
        handleShow(1);
    }

    const submitScore = async () => {
        await MatcheAPI.editScore(editMatch);

        setReload(reload+1);
        handleClose(1);
    }

    useEffect( () => {
        findMatches();
        FindTeams();
        FindMatchDayNumber();
    }, [id, reload]);

    return(
        <>
            <Link to={"/competition/"+id+"/view"} className={"btn btn-danger mb-5 ml-3"}><i className="fas fa-arrow-left"/></Link>
            <div className="form-group w-25">
                <select className="form-control" id="matchDay" name={"matchDay"} onChange={changeMatchDay}>
                    {createOptions(matchDayNumber)}
                </select>
            </div>
            <table className="table table-hover text-center whiteBorder">
                <thead className={"container"}>
                <tr className={"row ml-3 mr-3 "}>
                    <th className={"col-1"}>Date</th>
                    <th className={"col-3"}>Equipe à domicile</th>
                    <th className={'col-1'}></th>
                    <th className={"col-3"}>Equipe à l'extérieur</th>
                    <th className={'col-1'}></th>
                    <th className={"col-2"}></th>
                </tr>
                </thead>
                <tbody className={"container"}>
                    {matchOfDay.map((m, index) =>
                    <tr key={index} className={"row  ml-3 mr-3 "}>
                        <td className={"col-1"}>{DateFunctions.dateFormatFrDMHM(m.date, 1)}</td>
                        <td className={"col-3"}><div>{m.homeTeam.club.name}</div></td>
                        <td className={"col-1"}>
                            {m.originalHomeTeamGoal === null  &&
                            <input type={"number"} className={"form-control"}
                                   value={m.homeTeamGoal || 0} min={0} name={index}
                                   onChange={handleChangeGoalA}/>
                            ||
                            m.homeTeamGoal
                            }
                        </td>
                        <td className={"col-3"}><div>{m.visitorTeam.club.name}</div></td>
                        <td className={"col-1"}>
                            {m.originalVisitorTeamGoal === null &&
                            <input type={"number"} className={"form-control"}
                                   value={m.visitorTeamGoal || 0} min={0} name={index}
                                   onChange={handleChangeGoalB}/>
                            ||
                            m.visitorTeamGoal
                            }
                        </td>
                        <td className="col-2">
                            {m.isOver &&
                            <button onClick={() => modalScore(m)} className="btn btn-sm btn-warning">Modifier
                                score</button>
                            ||
                            <button onClick={() => openModal(m)} className="btn btn-sm btn-warning">Modifier
                                Date</button>
                            }
                            </td>
                    </tr>
                    )}
                </tbody>
            </table>
            <h3 className="m-3">Ajouter un match</h3>
            <div className={"row whiteBorder p-3"}>
                <div className={"col-4"}>
                    <ReactSearchBox
                        placeholder="Sélectionner une équipe"
                        data={clubs}
                        onSelect={record => setSelectClubA(record["key"])}
                        onFocus={() => {
                        }}
                        onChange={() => {
                        }}
                        fuseConfigs={{
                            threshold: 0.05,
                        }}
                    />
                    <div className="mt-3">
                        <Field name={"date"} label={"Date du match"} type={"date"} value={newMatch.date} onChange={handleChangeNewTeam} />
                    </div>
                </div>
                <div className={"col-4"}>
                    <ReactSearchBox
                        placeholder="Sélectionner une équipe"
                        data={clubs}
                        onSelect={record => setSelectClubB(record["key"])}
                        onFocus={() => {
                        }}
                        onChange={() => {
                        }}
                        fuseConfigs={{
                            threshold: 0.05,
                        }}
                    />
                    <div className="mt-3">
                        <Field name={"hour"} label={"heure du match"} type={"time"} value={newMatch.hour} onChange={handleChangeNewTeam} />
                    </div>
                </div>
                <div>
                    <button onClick={addMatch} className="btn btn-warning float-right">Ajouter match</button>
                </div>
            </div>
            <button onClick={handleSubmit} className="btn btn-danger mt-3 mb-5 float-right">Enregistrer</button>
            <Modal show={show[0]} onHide={() => handleClose(0)}>
                <Modal.Header closeButton>
                    Modifier la date et l'heure du match
                </Modal.Header>
                <Modal.Body className={""}>
                    <Field name={"date"} label={"Date du match"} min={DateFunctions.addYears(-1)} max={DateFunctions.addYears(3)} type={"date"} value={editMatch.date} onChange={handleChangeDate} />
                    <Field name={"hour"} label={"Heure du match"} type={"time"} value={editMatch.hour} onChange={handleChangeDate} />
                    <button onClick={() => submitDateMatch()} className="btn btn-warning">Enregistrer</button>
                </Modal.Body>
            </Modal>
            <Modal show={show[1]} onHide={() => handleClose(1)}>
                <Modal.Header closeButton>
                    Modifier le score du match
                </Modal.Header>
                <Modal.Body className={""}>
                    <div className="row">
                        <div className="col-8">
                            <p>{editMatch.teamA}</p>
                        </div>
                        <div className="col-4">
                            <Field name={"number"} min={0}  name={"goalA"} type={"number"} value={editMatch.goalA} onChange={handleChangeDate} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <p>{editMatch.teamB}</p>
                        </div>
                        <div className="col-4">
                            <Field name={"number"} min={0} name={"goalB"} type={"number"} value={editMatch.goalB} onChange={handleChangeDate} />
                        </div>
                    </div>
                    <button onClick={() => submitScore()} className="btn btn-warning">Enregistrer</button>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default MatchPages;