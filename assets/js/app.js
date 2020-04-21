import React, {useState, useContext} from "react";
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
import ClubsPage from "./pages/ClubsPage";
import ClubPage from "./pages/ClubPage";
import CompetitionViewPage from "./pages/CompetitionViewPage";
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
import RonvauTeamCalendar from "./pages/RonvauTeamCalendar";
import CompetitionTeamsPage from "./pages/CompetitionTeamsPage";


require("../css/app.css");

authAPI.setup();


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthenticated()
    );

    const NavBarWIthRouter = withRouter(NavBar);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            <HashRouter>
                <NavBarWIthRouter/>
                <main className="container mt-5">
                    <Switch>
                        <Route
                            path="/login"
                            render={ props => <LoginPage onLogin={setIsAuthenticated} {...props}/> }
                        />
                        <PrivateRoute path={"/profil"} component={ProfilPage}/>
                        <PrivateRoute path={"/competition/:id/matchs"} component={MatchPages}/>
                        <PrivateRoute path={"/competition/:id/view"} component={CompetitionViewPage}/>
                        <PrivateRoute path={"/competition/:id/équipes"} component={CompetitionTeamsPage}/>
                        <PrivateRoute path={"/competition/:id"} component={CompetitionPage}/>
                        <PrivateRoute path={"/competition"} component={CompetitionsPage}/>
                        <PrivateRoute path={"/covoit/:id"} component={CovoitEditPage}/>
                        <PrivateRoute path={"/covoit"} component={CovoitsPage}/>
                        <PrivateRoute path={"/teams"} component={TeamsPage}/>
                        <PrivateRoute path={"/club/:id"} component={ClubPage}/>
                        <PrivateRoute path={"/club"} component={ClubsPage}/>
                        <PrivateRoute path={"/equipeRonvau/:id/calendar"} component={RonvauTeamCalendar}/>
                        <PrivateRoute path={"/equipeRonvau/:id"} component={RonvauTeamPage}/>
                        <PrivateRoute path={"/equipeRonvau"} component={RonvauTeamsPage}/>
                        <PrivateRoute path={"/userAccess"} component={UserAcceptPage}/>
                        <Route path={"/register"} component={RegisterPage}/>
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer/>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
