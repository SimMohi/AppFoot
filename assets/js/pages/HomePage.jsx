import React, {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";
import DateFunctions from "../services/DateFunctions";
import TrainingsAPI from "../services/TrainingsAPI";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import MatcheAPI from "../services/MatcheAPI";


const HomePage = props => {

    const [idUser, setIdUser] = useState("");
    moment.locale('fr-FR');
    const Localizer = momentLocalizer(moment);
    const allViews = ["month"];

    const [show, setShow] = useState([false, false, false, false]);
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

    const [absence, setAbsence] = useState("");
    const [infos, setInfos] = useState([]);
    const [calendarInfos, setCalendarInfos] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState({
        title: "",
        infos: "",
        button: [],
        absences: [],
        staff: false
    });

    const [selectedTrainingUsers, setSelectedTrainingUsers] = useState([]);
    const [presence, setPresence] = useState([]);
    const [selectAllPre, setSelectAllPre] = useState(false);
    const [reload, setReload] = useState(0);

    const [editTraining, setEditTraining] = useState({
        date: "",
        start: "",
        end: ""
    })

    const [editMatch, setEditMatch] = useState({
        id: "",
        date: "",
        hour: "",
    });

    const find = async () => {
        const token = window.localStorage.getItem(("authToken"));
        const {id} = jwtDecode(token);
        const response = await RonvauTeamAPI.getPersonnalCalendarInfo(id);
        let calendarArr = [];
        for (let i = 0; i < response.length; i++){
            let obj = {
                title: response[i]["title"],
                start: response[i]["start"],
                end: response[i]["end"],
                type: response[i]["type"],
                id: response[i]["id"],
                abs: response[i]["abs"],
                staff: response[i]["staff"]
            }
            if (response[i]["staff"] == true){
                obj["absences"] = response[i]["absences"];
            }
            calendarArr.push(obj);
        }
        setIdUser(id);
        setInfos(response);
        setCalendarInfos(calendarArr);
    }

    console.log(calendarInfos);

    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;
        setAbsence(value);
    };

    const test = ( event ) => {
        let buttons = [];
        let obj={};
        if (event.type == "training"){
            if (event.abs == true){
                 buttons.push(<button onClick={() => deleteAbsence(event.id)} className="btn btn-sm btn-success">Annuler mon absence</button>);
            } else {
                buttons.push(<button onClick={() => handleShow(0)} className="btn btn-sm btn-danger">Prévenir une absence</button>);
            }
            if (event.staff == true){
                buttons.push(<button onClick={() => findTraining(selectedEvent.id)} className="btn btn-sm btn-primary">Encoder présences </button>);
                buttons.push(<button onClick={modalEditTraining} className="btn btn-sm btn-secondary">Modifier l'entrainement </button>);
            }
            obj = {
                id: event.id,
                title: event.title,
                day: event.start,
                end: event.end,
                button: buttons,
                absences: [],
                staff: event.staff
            }
            if (typeof event.absences != "undefined"){
                obj.absences =  event.absences;
            }
        } else if (event.type == "Match"){
            if (event.staff == true){
                buttons.push(<Link to={"/match/"+event.id+"/select"} className={"btn btn-sm btn-primary mr-3"}>Convocations</Link>);
                buttons.push(<button onClick={() => editMatchDate(event)} className="btn btn-sm btn-success">Date du match</button>);
            }
            obj = {
                id: event.id,
                title: event.title,
                day: event.start,
                end: event.end,
                button: buttons,
                staff: event.staff,
                absences: [],
            }
        }
        setSelectedEvent(obj);
    }

    const submitAbsence = async (idTraining) => {
        let post = {
            reason: absence,
            idUser: idUser,
            idTraining: idTraining
        }
        await TrainingsAPI.postAbsence(post);
    }

    const deleteAbsence = async (idTraining) => {
        let post = {
            idUser: idUser,
            idTraining: idTraining
        }
        await TrainingsAPI.remAbsence(post);
    }

    const findTraining = async (id) => {
        const response = await TrainingsAPI.getPlayerTrainings(id);
        let preArr = [];
        for (let i = 0; i < response.length; i++){
            preArr.push({
                id: response[i].id,
                value: response[i]["present"]
            });
        }
        setSelectAllPre(false);
        setPresence(preArr);
        setSelectedTrainingUsers(response);
        handleShow(1);
    }

    const changePresence = (i) => {
        let copyPresence = JSON.parse(JSON.stringify(presence));
        copyPresence[i]["value"] = !presence[i]["value"];
        if (copyPresence[i]["value"] == false){
            setSelectAllPre(false);
        }
        setPresence(copyPresence);
    }

    const selectAll = () => {
        let copy = JSON.parse(JSON.stringify(presence));
        for (let i = 0; i < copy.length; i++){
            copy[i]["value"] = !selectAllPre;
        }
        setPresence(copy);
        setSelectAllPre(!selectAllPre);
    }

    const submitPresence = async () => {
        await TrainingsAPI.postPresence(presence);
        handleClose(1);
    }

    const modalEditTraining = () => {
        let obj = {
            id: selectedEvent.id,
            date: DateFunctions.dateFormatYMD(selectedEvent.day),
            start: DateFunctions.getHoursHM(selectedEvent.day),
            end: DateFunctions.getHoursHM(selectedEvent.end),
        }
        setEditTraining(obj);
        handleShow(2);
    }

    const handleChangeTraining = ({currentTarget}) =>{
        const { name, value } = currentTarget;
        setEditTraining({...editTraining, [name]: value});
    };

    const submitTraining = async () => {
        if (editTraining.start > editTraining.end){
            toast.error("heure de début plus grande que heure de fin");
            return ;
        }
        await TrainingsAPI.editTraining(editTraining);
        handleClose(2);
        setReload(reload+1);
        window.location.reload();
    }

    const editMatchDate =  (match) => {
        console.log(match);
        let editMatchObj = {
            id: match.id,
            date: DateFunctions.dateFormatYMD(match.start),
            hour:  DateFunctions.getHoursHM(match.start),
        }
        console.log(editMatchObj);
        setEditMatch(editMatchObj);
        handleShow(3);
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
        handleClose(3);
        setReload(reload+1);
    }

    useEffect( () => {
        find();
    }, [reload]);

    return (
      <>
          <div className="container">
              <div className="row">
                  <div style={{ height: 700 }} className={"col-8"}>
                      <Calendar
                          onSelectEvent={event => test(event)}
                          selectable={true}
                          localizer={Localizer}
                          events={calendarInfos}
                          step={60}
                          views={allViews}
                          defaultDate={new Date()}
                      />
                  </div>
                  <div className="col-4 text-center">
                      {selectedEvent.title != "" &&
                        <h6>{selectedEvent.title} du {DateFunctions.dateFormatFr(selectedEvent.day)}</h6>
                      }
                      <div>{selectedEvent.button.map((butt, index) =>
                          <div key={index}>
                              {butt}
                          </div>
                      )}
                      </div>
                      <div>{selectedEvent.absences.map((ab, index) =>
                          <p key={index}>{ab.name+ " "+ ab.reason}</p>
                      )}</div>

                  </div>
              </div>
          </div>
          <Modal show={show[0]} onHide={() => handleClose(0)}>
              <Modal.Header closeButton>
                  Prévenir d'une Absence
              </Modal.Header>
              <Modal.Body className={""}>
                  <h6>{selectedEvent.title} du {DateFunctions.dateFormatFr(selectedEvent.day)}</h6>
                  <Field type={"text"} value={absence} onChange={handleChange} name={"reason"} label={"Raison de l'absence:"}/>
                  <button onClick={() => submitAbsence(selectedEvent.id)} className="btn btn-success">Enregistrer</button>
              </Modal.Body>
          </Modal>
          <Modal show={show[1]} onHide={() => handleClose(1)}>
              <Modal.Header closeButton>
                  Encodage des présences pour l'{selectedEvent.title} du {DateFunctions.dateFormatFr(selectedEvent.day)}
              </Modal.Header>
              <Modal.Body className={""}>
                  <div className={"custom-control custom-checkbox"}>
                      <input type="checkbox" className="custom-control-input" id={"All"} checked={selectAllPre} onChange={selectAll}/>
                      <label className="custom-control-label" htmlFor={"All"}>Tout sélectionner</label>
                  </div>
                  {selectedTrainingUsers.map((user, index) =>
                      <div className={"custom-control custom-checkbox"} key={index}>
                          <input type="checkbox" className="custom-control-input" id={"presence"+index} checked={presence[index]["value"]} onChange={() => changePresence(index)}/>
                          <label className="custom-control-label" htmlFor={"presence"+index}>{user.name}</label>
                      </div>
                  )}
                  <button onClick={submitPresence} className="btn btn-success">Enregistrer</button>
              </Modal.Body>
          </Modal>
          <Modal show={show[2]} onHide={() => handleClose(2)}>
              <Modal.Header closeButton>
                  Modifier l'{selectedEvent.title} du {DateFunctions.dateFormatFr(selectedEvent.day)}
              </Modal.Header>
              <Modal.Body className={""}>
                  <Field name={"date"} label={"Jour de l'entrainement"} type={"date"} value={editTraining.date} onChange={handleChangeTraining} />
                  <Field name={"start"} label={"Heure de début"} type={"time"} value={editTraining.start} onChange={handleChangeTraining} />
                  <Field name={"end"} label={"Heure de fin"} type={"time"} value={editTraining.end} onChange={handleChangeTraining} />
                  <button onClick={submitTraining} className="btn btn-success">Enregistrer</button>
              </Modal.Body>
          </Modal>
          <Modal show={show[3]} onHide={() => handleClose(3)}>
              <Modal.Header closeButton>
                  Modifier la date et l'heure du match
              </Modal.Header>
              <Modal.Body className={""}>
                  <Field name={"date"} label={"Date du match"} min={DateFunctions.addYears(-1)} max={DateFunctions.addYears(3)} type={"date"} value={editMatch.date} onChange={handleChangeDate} />
                  <Field name={"hour"} label={"Heure du match"} type={"time"} value={editMatch.hour} onChange={handleChangeDate} />
                  <button onClick={submitDateMatch} className="btn btn-success">Enregistrer</button>
              </Modal.Body>
          </Modal>
      </>

  );
};

export default HomePage;
