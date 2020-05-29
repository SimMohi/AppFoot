import React, {useState, useContext, useEffect} from "react";
import ReactDOM from "react-dom";
import "../css/app.css";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CompetitionPage from "./pages/CompetitionPage";
import TeamsPage from "./pages/TeamsPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionsPageUser from "./pages/CompetitionsPageUser";
import ClubsPage from "./pages/ClubsPage";
import ClubPage from "./pages/ClubPage";
import CompetitionViewPage from "./pages/CompetitionViewPage";
import MatchPagesUser from "./pages/MatchsPageUser";
import MatchPages from "./pages/MatchsPage";
import CovoitsPage from "./pages/CovoitsPage";
import CovoitEditPage from "./pages/CovoitEditPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilPage from "./pages/ProfilPage";
import RegisterPage from "./pages/RegisterPage";
import RonvauTeamsPage from "./pages/RonvauTeamsPage";
import RonvauTeamPage from "./pages/RonvauTeamPage";
import UserAcceptPage from "./pages/UserAcceptPage";
import RonvauTeamCalendarMatch from "./pages/RonvauTeamCalendarMatch";
import CompetitionTeamsPage from "./pages/CompetitionTeamsPage";
import SelectPlayerMatchPage from "./pages/SelectPlayerPage";
import RonvauTeamSelectPage from "./pages/RonvauTeamSelectPage";
import EncodeMatchPage from "./pages/EncodeMatchPage";
import ProfilUserPage from "./pages/ProfilUserPage";
import RonvauTeamCalendar from "./pages/RonvauTeamCalendar";
import EventsPage from "./pages/EventsPage";
import UsersPage from "./pages/UsersPage";
import jwtDecode from "jwt-decode";
import ChatPage from "./pages/ChatPage";
import EventsUser from "./pages/EventsUser";

require("../css/app.css");


authAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthenticated()
    );

    const isAdmin = authAPI.getIsAdmin();


    const NavBarWIthRouter = withRouter(NavBar);


    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            <HashRouter>
                <NavBarWIthRouter/>
                <main className="p-5 mt-5">
                    <Switch>
                        <Route
                            path="/login"
                            render={ props => <LoginPage onLogin={setIsAuthenticated} {...props}/> }
                        />

                        <Route path={"/register"} component={RegisterPage}/>
                        <PrivateRoute path={"/profil/:id"} component={ProfilUserPage}/>
                        <PrivateRoute path={"/profil"} component={ProfilPage}/>
                        {isAdmin &&
                        <PrivateRoute path={"/competition/:id/matchs"} component={MatchPages}/>
                        ||
                        <PrivateRoute path={"/competition/:id/matchs"} component={MatchPagesUser}/>
                        }
                        <PrivateRoute path={"/competition/:id/view"} component={CompetitionViewPage}/>
                        <PrivateRoute path={"/competition/:id/équipes"} component={CompetitionTeamsPage}/>
                        <PrivateRoute path={"/competition/:id"} component={CompetitionPage}/>
                        {!isAdmin &&
                            <>
                                <PrivateRoute path={"/competition"} component={CompetitionsPage}/>
                                <PrivateRoute path={"/events"} component={EventsPage}/>
                            </>
                            ||
                            <>
                                <PrivateRoute path={"/competition"} component={CompetitionsPageUser}/>
                                <PrivateRoute path={"/events"} component={EventsUser}/>
                            </>
                        }
                        <PrivateRoute path={"/covoit/:id"} component={CovoitEditPage}/>
                        <PrivateRoute path={"/covoit"} component={CovoitsPage}/>
                        <PrivateRoute path={"/teams"} component={TeamsPage}/>
                        {isAdmin &&
                            <PrivateRoute path={"/club/:id"} component={ClubPage}/>
                        }
                        <PrivateRoute path={"/club"} component={ClubsPage}/>
                        <PrivateRoute path={"/chat"} component={ChatPage}/>
                        <PrivateRoute path={"/match/:id/encode"} component={EncodeMatchPage}/>
                        <PrivateRoute path={"/match/:id/select"} component={SelectPlayerMatchPage}/>
                        <PrivateRoute path={"/equipeRonvau/:id/select"} component={RonvauTeamSelectPage}/>
                        <PrivateRoute path={"/equipeRonvau/:id/calendar"} component={RonvauTeamCalendar}/>
                        <PrivateRoute path={"/equipeRonvau/:id/matchCalendar"} component={RonvauTeamCalendarMatch}/>
                        <PrivateRoute path={"/equipeRonvau/:id"} component={RonvauTeamPage}/>
                        <PrivateRoute path={"/equipeRonvau"} component={RonvauTeamsPage}/>
                        <PrivateRoute path={"/userAccess"} component={UsersPage}/>
                        <PrivateRoute path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer/>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
