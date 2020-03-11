import React, {useState, useContext} from "react";
import ReactDOM from "react-dom";
import "../css/app.css";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import CustomersPage from "./pages/CustomerPage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CompetitionPage from "./pages/CompetitionPage";

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
                        <PrivateRoute path={"/competition/:id"} component={CompetitionPage}/>
                        <PrivateRoute path={"/competition"} component={CustomersPage}/>

                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
