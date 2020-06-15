import React, {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import RonvauTeamAPI from "../services/RonvauTeamAPI";
import {Calendar, momentLocalizer} from "../components/react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";
import DateFunctions from "../services/DateFunctions";
import TrainingsAPI from "../services/TrainingsAPI";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import MatcheAPI from "../services/MatcheAPI";
import EventsAPI from "../services/EventsAPI";
import NotificationAPI from "../services/NotificationAPI";
import UnOfficialMatchAPI from "../services/UnOfficialMatchAPI";
import ReactSearchBox from "react-search-box";
import ClubsAPI from "../services/ClubsAPI";


const HomePage = props => {

    const [idUser, setIdUser] = useState("");
    moment.locale('fr-FR');
    const Localizer = momentLocalizer(moment);

    const allViews = ["month"];

    const [show, setShow] = useState([false, false, false, false, false, false, false]);
    const handleShow = (i) => {
        let showCopy = [...show];
        showCopy[i] = true;
        setShow(showCopy);
    }

    const [newAction, setNewAction] = useState({
        date: DateFunctions.todayFormatYMD(),
        endDate: DateFunctions.todayFormatYMD(),
        start: "20:00",
        end: "21:30",
        isHome: true,
        name: "",
        description: "",
    })
    const [selectClub, setSelectClub] = useState({});
    const [newSelect, setNewSelect ] = useState(1);
    const [clubs, setClubs] = useState([]);

    const handleClose = (i) => {
        if (i == 7){
            setNewSelect(1);
        }
        let showCopy = [...show];
        showCopy[i] = false;
        setShow(showCopy);
    }

    const [absence, setAbsence] = useState("");
    const [infos, setInfos] = useState([]);
    const [calendarInfos, setCalendarInfos] = useState([]);
    const [editEvent, setEditEvent] = useState({
        date: "",
        start: "",
        end: ""
    })
    const [selectedEvent, setSelectedEvent] = useState({
        id: "",
        title: "",
        infos: "",
        button: [],
        absences: [],
        staff: false,
        details: [],
        called: [],
    });

    const [selectedTrainingUsers, setSelectedTrainingUsers] = useState([]);
    const [presence, setPresence] = useState([]);
    const [selectAllPre, setSelectAllPre] = useState(false);
    const [reload, setReload] = useState(0);
    const [staff, setStaff] = useState([]);
    const [team, setTeam] = useState(0);

    const [editTraining, setEditTraining] = useState({
        date: "",
        endDate: "",
        start: "",
        end: ""
    })

    const [editMatch, setEditMatch] = useState({
        id: "",
        date: "",
        hour: "",
    });
    const [MOTM, setMOTM] = useState([]);

    const resetselectedEvent = () => {
        setSelectedEvent({
            id: "",
            title: "",
            infos: "",
            button: [],
            absences: [],
            staff: false})
    }

    const find = async () => {
        const token = window.localStorage.getItem(("authToken"));
        const {id} = jwtDecode(token);
        try {
            const responseFull = await RonvauTeamAPI.getPersonnalCalendarInfo(id);
            let response = responseFull["infos"];
            if (responseFull["staff"].length > 0){
                setTeam(responseFull["staff"][0].id)
                setStaff(responseFull["staff"]);
            }
            let calendarArr = [];
            for (let i = 0; i < response.length; i++){
                let obj = {
                    title: response[i]["title"],
                    start: response[i]["start"],
                    end: response[i]["end"],
                    type: response[i]["type"],
                    id: response[i]["id"],
                    abs: response[i]["abs"],
                    player: response[i]["player"],
                    staff: response[i]["staff"],
                    isOver: response[i]["isOver"],
                    players: response[i]["players"],
                    unOffplayers: response[i]["unOffPlayers"],
                    team: response[i]["teamCat"],
                    teamId: response[i]["teamId"],
                    eventTeamId: response[i]["eventTeamId"],
                    sub: response[i]["sub"],
                    description: response[i]["description"],
                    perso: response[i]["perso"],
                    address: response[i]["address"],
                    details: response[i]["details"],
                    goalA: response[i]["goalA"],
                    goalB: response[i]["goalB"],
                    called: response[i]["called"],
                    score: response[i]["score"],
                    compet: response[i]["compet"],
                    appointment: response[i]["appointment"]
                }
                if (response[i]["staff"] == true){
                    obj["absences"] = response[i]["absences"];
                    obj["presences"] = response[i]["presences"];
                }
                calendarArr.push(obj);
            }
            setIdUser(id);
            setInfos(response);
            setCalendarInfos(calendarArr);
        } catch (e) {
            toast.error("Erreur");
        }
    }


    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;
        setAbsence(value);
    };

    const test = ( event ) => {
        let buttons = [];
        let obj={};
        if (event.type == "training"){
            if (!(event.staff == false && event.player == false)){
                if (event.abs == true){
                    buttons.push(<button onClick={() => deleteAbsence(event.id)} className="btn  btn-warning">Annuler mon absence</button>);
                } else {
                    buttons.push(<button onClick={() => handleShow(0)} className="btn  btn-danger">Prévenir une absence</button>);
                }
                if (event.staff == true){
                    buttons.push(<button onClick={() => findTraining(event.id)} className="btn  btn-outline-danger">Encoder présences </button>);
                    buttons.push(<button onClick={() => modalEditTraining(event)} className="btn  btn-warning">Modifier l'entrainement </button>);
                    buttons.push(<button onClick={() => deleteTraining(event.id)} className="btn  btn-danger">Supprimer l'entrainement </button>);
                }
            }
            const description =
                <div>
                    <p><b>Début</b>: {DateFunctions.getHoursHM(event.start, 1)} <b>fin</b>: {DateFunctions.getHoursHM(event.end, 1)}</p>
                </div>
            obj = {
                id: event.id,
                type: event.type,
                teamId: event.teamId,
                title: event.title,
                day: event.start,
                end: event.end,
                button: buttons,
                absences: [],
                presences: event.presences,
                staff: event.staff,
                description: description
            }
            if (typeof event.absences != "undefined"){
                obj.absences =  event.absences;
            }
        } else if (event.type == "Match"){
            if (event.staff == true){
                if (!event.isOver){
                    buttons.push(<Link to={"/match/"+event.id+"/select"} className={"btn btn-warning mr-3"}>Convocations</Link>);
                    buttons.push(<button onClick={() => editMatchDate(event)} className="btn btn-danger">Date du match</button>);
                }
                buttons.push(<Link to={"/match/"+event.id+"/encode"} className={"btn btn-warning mr-3"}>Encoder statistiques</Link>);
            } else {
                if (event.isOver){
                    buttons.push(<button onClick={() => handleShow(5)} className="btn btn-warning">Details</button>);
                } else {
                    buttons.push(<button onClick={() => handleShow(6)} className="btn btn-warning">Liste des convoqués</button>);
                }
            }
            const description =
                <div>
                    <span className={"mr-3 mt-2"}>{event.compet}</span><span className={"ml-3"}>{event.team}</span>
                    {event.isOver &&
                        event.goalA != null && event.goalB != null &&
                            <p><b>Score</b> : {event.goalA}-{event.goalB}</p>
                    }
                    {!event.isOver &&
                        <>
                        <p className={"mt-2"}><b>Début</b>: {DateFunctions.getHoursFRHM(event.start)}</p>
                        {event.appointment != null &&
                            <p className={"mt-2"}><b>Heure de RDV sur
                            place</b>: {DateFunctions.getHoursHMV2(event.appointment)}</p>
                        }
                        <p>{event.perso}</p>
                        <p><b>Adresse : </b>{event.address}</p>
                        </>
                    }
                </div>
            obj = {
                id: event.id,
                teamId: event.teamId,
                title: event.title,
                day: event.start,
                end: event.end,
                button: buttons,
                staff: event.staff,
                absences: [],
                description: description,
                players: event.players,
                details: event.details,
                called: event.called,
                appointment: event.appointment
            }
            let radioMOTM = [];
            for (let i = 0; i < event.players.length; i++){
                radioMOTM.push(false);
            }
            setMOTM(radioMOTM);
        } else if (event.type == "event"){
            const description =
                <div>
                    <p><b>Description</b>: {event.description}</p>
                    <p><b>Début</b>: {DateFunctions.dateFormatFrDMHM(event.start)}</p>
                    <p><b>fin</b>: {DateFunctions.dateFormatFrDMHM(event.end)}</p>
                </div>
            obj = {
                id: event.id,
                type: event.type,
                description: description,
                title: event.title + " pour " + event.team,
                day: event.start,
                end: event.end,
                button: buttons,
                absences: [],
                presences: [],
            }
            if (event.sub === false){
                buttons.push(<button onClick={() => subscribeEvent(event.eventTeamId)} className={"btn btn-warning mr-3"}>S'inscrire</button>);
            } else {
                buttons.push(<button onClick={() => unSubscribeEvent(event.eventTeamId)} className={"btn btn-danger mr-3"}>Se désinscrire</button>);
            }
        } else if (event.type == "Amical"){
            if (event.staff == true){
                if (!event.isOver){
                    buttons.push(<Link to={"/unOffMatch/"+event.id+"/select"} className={"btn btn-warning mr-3"}>Convocations</Link>);
                    buttons.push(<button onClick={() => editMatchDate(event)} className="btn btn-danger">Date du match</button>);
                    buttons.push(<button onClick={() => deleteUnOffMatch(event.id)} className="btn btn-danger">Supprimer match</button>);
                }
                buttons.push(<Link to={"/unOffMatch/"+event.id+"/encode"} className={"btn btn-warning mr-3"}>Encoder statistiques</Link>);
            } else {
                if (event.isOver){
                    buttons.push(<button onClick={() => handleShow(5)} className="btn btn-warning">Details</button>);
                } else {
                    buttons.push(<button onClick={() => handleShow(6)} className="btn btn-warning">Liste des convoqués</button>);
                }
            }
            const description =
                <div>
                    <p>Match Amical {event.team}</p>
                    {event.isOver &&
                        <p><b>Score : </b>{event.score}</p>
                        ||
                        <>
                        <p><b>Début</b>: {DateFunctions.getHoursHMV2(event.start, 1)}</p>
                        {event.appointment != null &&
                        <p><b>Heure de RDV sur place</b>: {DateFunctions.getHoursHMV2(event.appointment)}</p>
                        }
                        <p>{event.perso}</p>
                        <p><b>Adresse : </b>{event.address}</p>
                        </>
                    }
                </div>
            obj = {
                id: event.id,
                type: event.type,
                teamId: event.teamId,
                title: event.title,
                day: event.start,
                end: event.end,
                button: buttons,
                staff: event.staff,
                description: description,
                absences: [],
                unOffplayers: event.unOffplayers,
                details: event.details,
                called: event.called,
                score: event.score,
                appointment: event.appointment

            }
            let radioMOTM = [];
            for (let i = 0; i < event.players.length; i++){
                radioMOTM.push(false);
            }
            setMOTM(radioMOTM);
        }
        setSelectedEvent(obj);
    }

    const deleteUnOffMatch = async (id)=> {
        try{
            await UnOfficialMatchAPI.deleteUnOff({id :id});
            setReload(reload+1);
            resetselectedEvent();
        } catch (e) {
            toast.error("Erreur lors de la suppression du match");
        }
    }

    const subscribeEvent = async (idEventTeam) => {
        const data = {
            user: idUser,
            eventTeam: idEventTeam,
        }
        try {
            await EventsAPI.createUTE(data);
            toast.success("Vous êtes inscrits à l'évenement");
        } catch (e) {
            toast.error("Erreur lors de l'inscription");
        }
        setReload(reload+1);
        resetselectedEvent();
    }

    const unSubscribeEvent = async (idEventTeam) => {
        const data = {
            user: idUser,
            eventTeam: idEventTeam,
        }
        try {
            await EventsAPI.unSubUTE(data);
            toast.success("désinscription réussie");
        } catch (e) {
            toast.error("Erreur lors de la désinscription");
        }
        setReload(reload+1);
        resetselectedEvent();
    }

    const changeMOTM = (index) => {
        let copy = JSON.parse(JSON.stringify(MOTM));
        for(let i = 0; i < copy.length; i++){
            if (i == index){
                copy[i] = true;
            } else {
                copy[i] = false;
            }
        }
        setMOTM(copy);
    }

    const submitPlayerOfTheMatch = async () =>{
        for (let i = 0; i < MOTM.length; i++){
            if (MOTM[i]){
                let vote = {
                    idPlayerMatch: selectedEvent["players"][i]["player"]["id"],
                    idUser: idUser
                }
                await MatcheAPI.voteMOTM(vote);
                handleClose(4);
                return ;
            }
        }
        toast.warn("Sélectionnez un joueur");
    }

    const submitAbsence = async (idTraining) => {
        let post = {
            reason: absence,
            idUser: idUser,
            idTraining: idTraining
        }
        try{
            await TrainingsAPI.postAbsence(post);
            toast.success("Absence encodée avec succès");
        } catch (e) {
            toast.error("Erreur lors de l'encodage de l'absence");
        }
        handleClose(0);
        setReload(reload+1);
        resetselectedEvent();
    }

    const deleteAbsence = async (idTraining) => {
        let post = {
            idUser: idUser,
            idTraining: idTraining
        }
        try{
            await TrainingsAPI.remAbsence(post);
            toast.success("Absence supprimée avec succès");
        } catch (e) {
            toast.error("Erreur lors de la suppression de l'absence");
        }
        setReload(reload+1);
        resetselectedEvent();
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

    const modalEditTraining = (event) => {
        let obj = {
            id: event.id,
            date: DateFunctions.dateFormatYMD(event.start),
            start: DateFunctions.getHoursHM(event.start),
            end: DateFunctions.getHoursHM(event.end),
        }
        setEditTraining(obj);
        handleShow(2);
    }

    const handleChangeTraining = ({currentTarget}) =>{
        const { name, value } = currentTarget;
        setEditTraining({...editTraining, [name]: value});
    };

    const submitTraining = async (event) => {
        if (editTraining.start > editTraining.end){
            toast.error("heure de début plus grande que heure de fin");
            return ;
        }
        let newNotif = {idTeam : selectedEvent.teamId,
            message: "L'entrainement du " + DateFunctions.dateFormatFrDM(selectedEvent.day)+ " a été déplacé au " + DateFunctions.dateFormatFrDM(editTraining.date) + " de "
                + DateFunctions.hourWh(editTraining.start) + " à " +  DateFunctions.hourWh(editTraining.end),
        }
        await TrainingsAPI.editTraining(editTraining);
        await NotificationAPI.newTeamNotif(newNotif)
        handleClose(2);
        setReload(reload+1);
        resetselectedEvent();
    }

    const submitEvent = async (event) => {
        if (editTraining.start > editTraining.end){
            toast.error("heure de début plus grande que heure de fin");
            return ;
        }
        let newNotif = {idTeam : selectedEvent.teamId,
            message: "L'événement "+ selectedEvent.title + " du " + DateFunctions.dateFormatFrDM(selectedEvent.day)+ " a été déplacé au " + DateFunctions.dateFormatFrDM(editTraining.date) + " de "
                + DateFunctions.hourWh(editTraining.start) + " à " +  DateFunctions.hourWh(editTraining.end),
        }
        return ;
        await TrainingsAPI.editTraining(editTraining);
        await NotificationAPI.newTeamNotif(newNotif)
        handleClose(2);
        setReload(reload+1);
        resetselectedEvent();
    }

    const editMatchDate =  (match) => {
        let editMatchObj = {
            id: match.id,
            date: DateFunctions.dateFormatYMD(match.start),
            hour:  DateFunctions.getHoursHM(match.start),
        }
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
        let newNotif = {idTeam : selectedEvent.teamId,
            message: "Le match " + selectedEvent.title + " a été déplacé au " + DateFunctions.dateFormatFrDM(editMatch.date) + " à " +  DateFunctions.hourWh(editMatch.hour),
        }
        try{
            if (selectedEvent.type == "Amical"){
                await UnOfficialMatchAPI.editDateUnOffMatch(editMatch);
            } else {
                await MatcheAPI.editDateMatch(editMatch);
            }
            await NotificationAPI.newTeamNotif(newNotif)
            toast.success("La date du match a bien été encodée");
        }catch (e) {
            toast.error("La date du match n'a pas pu être encodée");
        }
        handleClose(3);
        setReload(reload+1);
    }

    const addAction = () => {
        fetchClubs();
        handleShow(7);
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

    const changeAdd = ({currentTarget}) => {
        const value = (currentTarget.value);
        setNewSelect(value);
    }

    const handleChangeNewAction = ({currentTarget}) => {
        const { name, value } = currentTarget;
        if (name == "isHome"){
            setNewAction({...newAction, ["isHome"]: !newAction.isHome});
        } else {
            setNewAction({...newAction, [name]: value});
        }
    }

    const changeTeam = ({currentTarget}) => {
        const value = (currentTarget.value);
        setTeam(value);
    }


    const addNew = async () => {
        if (newSelect == 2 && typeof selectClub.key =="undefined" ){
            toast.warn("Encodez un club");
            return ;
        }
        let date = "";
        let endDate = "";
        if (newSelect == 3){
            date = new Date(newAction.date + " " + newAction.start);
            endDate = new Date(newAction.endDate + " " + newAction.end);
        } else {
            date = newAction.date;
        }
        const post = {
            teamId: team,
            date: date,
            start: newAction.start,
            end: newAction.end,
            clubId: selectClub.key,
            type: newSelect,
            isHome: newAction.isHome,
            name: newAction.name,
            description: newAction.description,
            endDate: endDate,
        }
        try{
            await RonvauTeamAPI.addAction(post);
            handleClose(7);
            setReload(reload+1);
        } catch (e) {
            toast.error("Erreur lors de l'ajout");
        }
    }

    const deleteTraining = async(id) => {
        try{
            await TrainingsAPI.delTraining({id: id});
            toast.success("Supprimé avec succès");
        } catch (e) {
            toast.error("Erreur lors de la suppression");
        }
        setReload(reload+1);
        resetselectedEvent();
    }


    useEffect( () => {
        find();
    }, [reload]);

    return (
      <>
          {staff.length > 0 &&
            <button onClick={addAction} className="btn btn-danger mb-3 "><i className="fas fa-plus"></i></button>
          }
          <div className="">
              <div className="d-flex">
                  <div className={"col-8 whiteBorder "}>
                      <h3 className={"text-center mb-4 roboto pt-3"}>Mon calendrier</h3>
                      <div style={{ height: 700 }} className={"pt-3 pb-3 mr-5"}>
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
                  </div>
                  {selectedEvent.id != 0 &&
                  <div className="col-3 text-center whiteBorder pt-3 ml-5 align-self-start">
                      {selectedEvent.title != "" &&
                      <h6>{selectedEvent.title} du {DateFunctions.dateFormatFr(selectedEvent.day)}</h6>
                      }
                      <div>
                          {selectedEvent.description}
                      </div>
                      {selectedEvent.button.length == 1 &&
                      <div className={""}>{selectedEvent.button.map((butt, index) =>
                          <div key={index} className={"m-2"}>
                              {butt}
                          </div>
                      )}
                      </div>
                      ||
                      <div
                          className={"d-flex flex-wrap justify-content-around"}>{selectedEvent.button.map((butt, index) =>
                          <div key={index} className={"m-2"}>
                              {butt}
                          </div>
                      )}
                      </div>
                      }
                      <div>
                      {selectedEvent.type == "training" && selectedEvent.absences.length > 0 && selectedEvent.staff &&
                          <h6 className={"mt-3"}>Liste des absents</h6>
                          }
                          {selectedEvent.absences.map((ab, index) =>
                              <p key={index}>{ab.name + " : " + ab.reason}</p>
                          )}</div>
                  </div>
                  }
              </div>
          </div>
          <Modal show={show[0]} onHide={() => handleClose(0)}>
              <Modal.Header closeButton>
                  Prévenir d'une Absence
              </Modal.Header>
              <Modal.Body className={""}>
                  <h6>{selectedEvent.title} du {DateFunctions.dateFormatFr(selectedEvent.day)}</h6>
                  <Field type={"text"} value={absence} onChange={handleChange} name={"reason"} label={"Raison de l'absence:"}/>
                  <button onClick={() => submitAbsence(selectedEvent.id)} className="btn btn-danger">Enregistrer</button>
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
                  <button onClick={() => submitPresence()} className="btn btn-warning mt-3">Enregistrer</button>
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
                  <button onClick={() => submitTraining(selectedEvent)} className="btn btn-warning">Enregistrer</button>
              </Modal.Body>
          </Modal>
          <Modal show={show[3]} onHide={() => handleClose(3)}>
              <Modal.Header closeButton>
                  Modifier la date et l'heure du match
              </Modal.Header>
              <Modal.Body className={""}>
                  <Field name={"date"} label={"Date du match"} min={DateFunctions.addYears(-1)} max={DateFunctions.addYears(3)} type={"date"} value={editMatch.date} onChange={handleChangeDate} />
                  <Field name={"hour"} label={"Heure du match"} type={"time"} value={editMatch.hour} onChange={handleChangeDate} />
                  <button onClick={() => submitDateMatch()} className="btn btn-warning">Enregistrer</button>
              </Modal.Body>
          </Modal>
          <Modal show={show[4]} onHide={() => handleClose(4)}>
              <Modal.Header closeButton>
                  Votez pour l'homme du match
              </Modal.Header>
              <Modal.Body className={""}>
                  {typeof selectedEvent["players"] != 'undefined' && selectedEvent["players"].map((player, index) =>
                      <div key={index} className="custom-control custom-radio">
                          <input type="radio" id={"customRadio"+index} name="customRadio" className="custom-control-input"
                                 disabled="" value={player["player"]["id"]} checked={MOTM["index"]} onChange={()=> changeMOTM(index)}/>
                          <label className="custom-control-label" htmlFor={"customRadio"+index}>{player.name}</label>
                      </div>
                  )}
                  <button onClick={() => submitPlayerOfTheMatch()} className="btn btn-warning mt-5">Valider</button>
              </Modal.Body>
          </Modal>
          <Modal show={show[5]} onHide={() => handleClose(5)}>
              <Modal.Header closeButton>
                  Détails du match
              </Modal.Header>
              <Modal.Body className={""}>
                  <div className="row">
                      <div className={"col-6"}>
                          <h6>Joueurs</h6>
                          {typeof selectedEvent["details"] != "undefined" && selectedEvent["details"].map((play, index) =>
                              <div key={index}>{play.name}</div>
                          )}
                      </div>
                      <div className="col-6">
                          <h6>Goals</h6>
                          {typeof selectedEvent["details"] != "undefined" && selectedEvent["details"].map((play, index) =>
                              play["goal"] > 0 &&
                              <div key={index}>{play.name}</div>
                          )}
                          <h6 className={"mt-3"}>Cartons Jaunes</h6>
                          {typeof selectedEvent["details"] != "undefined" && selectedEvent["details"].map((play, index) =>
                              play["yellow"] > 0 &&
                              <div key={index}>{play.name}</div>
                          )}
                          <h6 className={"mt-3"}>Cartons Rouges</h6>
                          {typeof selectedEvent["details"] != "undefined" && selectedEvent["details"].map((play, index) =>
                              play["red"] > 0 &&
                              <div key={index}>{play.name}</div>
                          )}
                      </div>
                  </div>
              </Modal.Body>
          </Modal>
          <Modal show={show[6]} onHide={() => handleClose(6)}>
              <Modal.Header closeButton>
                  Liste des convoqués pour ce match
              </Modal.Header>
              <Modal.Body className={""}>
                  {typeof selectedEvent["called"] != "undefined" && selectedEvent["called"].map((p, index) =>
                      <p key={index}>{p}</p>
                  )}
              </Modal.Body>
          </Modal>
          <Modal show={show[7]} onHide={() => handleClose(7)}>
              <Modal.Header closeButton>
                  Que souhaitez-vous ajouter ?
              </Modal.Header>
              <Modal.Body className={""}>
                  <div className="form-group">
                      <select className="custom-select" onChange={changeAdd} defaultValue={"1"}>
                          <option value="1"> Un entrainement</option>
                          <option value="2">Un match amical</option>
                          <option value="3">Un événement</option>

                      </select>
                  </div>
                  {newSelect == 1 &&
                      <>
                      <Field name={"date"} label={"Jour de l'entrainement"} type={"date"} value={newAction.date} onChange={handleChangeNewAction}/>
                      <Field name={"start"} label={"heure de début"} type={"time"} value={newAction.start} onChange={handleChangeNewAction}/>
                      <Field name={"end"} label={"heure de début"} type={"time"} value={newAction.end} onChange={handleChangeNewAction}/>
                      </>
                  }
                  {newSelect == 2 &&
                      <>
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
                      <Field name={"date"} label={"Jour du match"} type={"date"} value={newAction.date} onChange={handleChangeNewAction}/>
                      <Field name={"start"} label={"heure du match"} type={"time"} value={newAction.start} onChange={handleChangeNewAction}/>
                      <div className={"custom-control custom-checkbox mb-3 mt-3"}>
                          <input type="checkbox" className="custom-control-input" name={"isHome"} id={"isHome"} checked={newAction.isHome} onChange={handleChangeNewAction}/>
                          <label className="custom-control-label" htmlFor={"isHome"}>Se joue à domicile</label>
                      </div>
                      </>
                  }
                  {newSelect == 3 &&
                  <>
                      <Field name={"name"} label={"Nom de l'événement"} type={"text"} value={newAction.name} onChange={handleChangeNewAction} />
                      <div className="form-group">
                          <label htmlFor="exampleTextarea">Description de l'événement</label>
                          <textarea className="form-control" id="exampleTextarea" rows="3" name={"description"}
                                    value={newAction.description} onChange={handleChangeNewAction}/>
                      </div>
                      <div className="row">
                          <div className="col-6">
                              <Field name={"date"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Début de l'événement"} type={"date"} value={newAction.date} onChange={handleChangeNewAction}/>
                              <Field name={"start"} label={"Heure de début"} type={"time"} value={newAction.start} onChange={handleChangeNewAction}/>
                          </div>
                          <div className="col-6">
                              <Field name={"endDate"} min={DateFunctions.todayFormatYMD()} max={DateFunctions.addYears(3)} label={"Fin de l'événement"} type={"date"} value={newAction.endDate} onChange={handleChangeNewAction}/>
                              <Field name={"end"} label={"Heure de fin"} type={"time"} value={newAction.end} onChange={handleChangeNewAction}/>
                          </div>
                      </div>
                  </>
                  }
                  <select className="custom-select" onChange={changeTeam}>
                      {staff.map(staff =>
                          <option key={staff.id} value= {staff.id}>{staff.name}</option>
                      )}
                  </select>
                  <button onClick={() => addNew()} className="btn btn-danger float-right mt-3">Valider</button>
              </Modal.Body>
          </Modal>
      </>

  );
};

export default HomePage;
