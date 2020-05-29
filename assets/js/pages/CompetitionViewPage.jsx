import React, {useEffect, useState} from 'react';
import ClubsAPI from "../services/ClubsAPI";
import TeamsAPI from "../services/TeamsAPI";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import authAPI from "../services/authAPI";

const  CompetitionViewPage = props => {

    const {id} = props.match.params;
    const isAdmin = authAPI.getIsAdmin();

    const [teams, setTeams] = useState([]);

    const getTeams = async () => {
        try{
            const teamsCompet = await CompetitionsAPI.getRanking(id);
            setTeams(teamsCompet);
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        getTeams();
    }, [id]);

    function orderByPoints(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.points;
        const bandB = b.points;

        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    const orderTeams = [...teams];
    orderTeams.sort(orderByPoints);

    return (
      <>
          <table className="table table-hover text-">
              <thead>
              <tr>
                  <th>Nom</th>
                  <th>Jouer</th>
                  <th>Gagner</th>
                  <th>Nul</th>
                  <th>Perdu</th>
                  <th>Points</th>
              </tr>
              </thead>
              <tbody>
              {orderTeams.map(team =>
                  <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>{team.played}</td>
                      <td>{team.won} </td>
                      <td>{team.drawn}</td>
                      <td>{team.lost}</td>
                      <td>{team.points}</td>
                  </tr>
              )}
              </tbody>
          </table>
          {!isAdmin &&
              <Link to={"/competition/" + id + "/matchs"} className={"btn btn-info float-right"}>Ajouter des matchs</Link>
          }
      </>
    );
}

export default CompetitionViewPage ;