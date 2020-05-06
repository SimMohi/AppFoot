import React, {useEffect, useState} from 'react';
import MatcheAPI from "../services/MatcheAPI";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import DateFunctions from "../services/DateFunctions";
import Field from "../components/forms/Fields";
import {toast} from "react-toastify";

const RonvauTeamCalendarMatch = props => {

    const {id} = props.match.params;
    const [matchTeamRonvau, setMatchTeamRonvau] = useState([]);
    const [show, setShow] = useState(false);
    const [editMatch, setEditMatch] = useState({
        id: "",
        date: "",
        hour: "20:00",
    });

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const fetchMatch = async () => {
        const response = await MatcheAPI.getRonvauTeamMatch(id);
        response.sort(orderByMatchDay);
        setMatchTeamRonvau(response);
    }

    const editMatchDate =  (match) => {
        let copy = JSON.parse(JSON.stringify(editMatch));
        copy["id"] = match.id;
        if (match.date !== null){
            copy["date"] = DateFunctions.dateFormatYMD(match.date);
            copy["hour"] = DateFunctions.getHoursHM(match.date);
        }
        setEditMatch(copy);
        handleShow();
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
            await MatcheAPI.editDateMatch(editMatch);
            toast.success("La date du match a bien été encodée");
        }catch (e) {
            toast.error("La date du match n'a pas pu être encodée");
        }
        handleClose();
        fetchMatch();
    }

    function orderByMatchDay(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.matchDay;
        const bandB = b.matchDay;

        let comparison = 0;
        if (bandA < bandB) {
            comparison = -1;
        } else if (bandA > bandB) {
            comparison = 1;
        }
        return comparison;
    }


    useEffect( () => {
        fetchMatch();
    }, []);

    return(
        <>
            <table className="mt-5 table table-hover text-center container">
                <thead className={""}>
                    <tr className={"row"}>
                        <th className={"col-1"}>Journée</th>
                        <th className={"col-1"}>Date</th>
                        <th className={"col-3"}>Domicile</th>
                        <th className={"col-3"}>Extérieur</th>
                        <th className={"col-2"}>Score</th>
                        <th className={"col-2"}></th>
                    </tr>
                </thead>
                <tbody>
                {matchTeamRonvau.map(mtr =>
                    <tr key={mtr.id} className={"row"}>
                        <td className={"col-1"}>{mtr.matchDay}</td>
                        {mtr.date != null &&
                            <td className={"col-1"}>{DateFunctions.dateFormatFrDM(mtr.date)} &nbsp;
                                {mtr.date != null &&
                                <Moment format="HH:mm">
                                    {mtr.date}
                                </Moment>
                                }
                            </td>
                        || <td className={'col-1'}>Non défini</td>
                        }
                        <td className={"col-3"}>{mtr.homeTeam.club.name}</td>
                        <td className={"col-3"}>{mtr.visitorTeam.club.name}</td>
                        <td className={"col-2"}>{mtr.isOver && (mtr.homeTeamGoal+"-"+mtr.visitorTeamGoal)
                        ||
                            <>
                                <button onClick={() => editMatchDate(mtr)}
                                        className="btn btn-sm btn-success">Date du match
                                </button>
                                <Link to={"/match/"+mtr.id+"/select"} className={"btn btn-sm btn-primary mr-3"}>Convocations</Link>
                            </>
                        }</td>
                        <td className={"col-2"}>
                            <Link to={"/match/"+mtr.id+"/encode"} className={"btn btn-sm btn-secondary"}>Encodage</Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    Encoder la date et l'heure du match
                </Modal.Header>
                <Modal.Body className={""}>
                    <Field name={"date"} label={"Date du match"} min={DateFunctions.addYears(-1)} max={DateFunctions.addYears(3)} type={"date"} value={editMatch.date} onChange={handleChangeDate} />
                    <Field name={"hour"} label={"Heure du match"} type={"time"} value={editMatch.hour} onChange={handleChangeDate} />
                    <button onClick={submitDateMatch} className="btn btn-success">Enregistrer</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RonvauTeamCalendarMatch;