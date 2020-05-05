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


const HomePage = props => {

    const [idUser, setIdUser] = useState("");
    moment.locale('fr-FR');
    const Localizer = momentLocalizer(moment);
    const allViews = ["month"];

    const [show, setShow] = useState([false, false, false]);
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
        button: "",
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

    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;
        setAbsence(value);
    };

    const test = ( event ) => {
        let button;
        if (event.type == "training"){
            if (event.abs == true){
                 button =  <button onClick={() => deleteAbsence(event.id)} className="btn btn-sm btn-success">Annuler mon absence</button>;
            } else {
                 button = <button onClick={() => handleShow(0)} className="btn btn-sm btn-danger">Prévenir une absence</button>;
            }
            let obj = {
                id: event.id,
                title: event.title,
                day: event.start,
                end: event.end,
                button: button,
                absences: [],
                staff: event.staff
            }
            if (typeof event.absences != 'undefined'){
                obj["absences"] = event.absences;
            }
            setSelectedEvent(obj);
        } else if (event.type == "event"){

        }
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
                      <p>{selectedEvent.button} {selectedEvent.staff &&
                      <>
                          <button onClick={() => findTraining(selectedEvent.id)}
                                  className="btn btn-sm btn-primary">Encoder présences
                          </button>
                          <button onClick={modalEditTraining}
                                  className="btn btn-sm btn-secondary">Modifier l'entrainement
                          </button>
                      </>
                      }
                      </p>
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
      </>

  );
};

export default HomePage;
