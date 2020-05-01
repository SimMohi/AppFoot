import React, {useEffect} from "react";
import jwtDecode from "jwt-decode";
import RonvauTeamAPI from "../services/RonvauTeamAPI";

const HomePage = props => {

    const find = async () => {
        const token = window.localStorage.getItem(("authToken"));
        const {id} = jwtDecode(token);
        const response = await RonvauTeamAPI.getPersonnalCalendarInfo(id);
        console.log(response);
    }


    useEffect( () => {
        find();
    }, []);
  return (
      <>
      </>

  );
};

export default HomePage;
