import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import ClubsAPI from "../services/ClubsAPI";
import TrainingsAPI from "../services/TrainingsAPI";
import DateFunctions from "../services/DateFunctions";

const TrainingResumePage = props => {
    const {id} = props.match.params;
    const [trainings, setTrainings] = useState([]);
    const [players, setPlayers] = useState([]);

    const fetchTraining = async () => {
        try{
            const response = await TrainingsAPI.getTrainingResume(id);
            const players = response["trainings"];
            setPlayers(players);
            let trains = response["trainings"][0]["trainings"];
            trains.sort(DateFunctions.orderByDate);
            setTrainings(trains);
        } catch (e) {
            console.log(e);
        }
    }

    // const createTd = (player) => {
    //     console.log(player);
    //     let retur = [];
    //     player["trainings"].map(
    //         retur += <td></td>;
    //     )
    // }

    useEffect( () => {
        fetchTraining();
    }, []);

    return(
        <>
            <Link to={"/equipeRonvau/"+id+"/select"} className={"btn btn-danger mr-3 mb-5"}><i className="fas fa-arrow-left"></i></Link>
            <h4 className={"mb-5"}>Présences aux entrainements lors des trois dernières semaines</h4>
            <table className="table table-hover whiteBorder">
                <thead>
                <tr className={"text-center"}>
                    <th></th>
                    {trainings.map((tr, index) =>
                        <th key={index}>{DateFunctions.dateFormatFrDM(tr.date)}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                    {players.map((p, index3) =>
                        <tr key={index3} className={"text-center"}>
                            <td>{p.name}</td>
                            {p["trainings"].map((t, index2) =>
                                <td key={index2}>
                                    {t.present &&
                                        <i className="fas fa-check"></i>
                                        ||
                                        <i className="fas fa-times"></i>
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default TrainingResumePage;