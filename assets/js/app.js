import React from "react";
import ReactDOM from "react-dom";
import "../css/app.css";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomersPage from "./pages/CustomerPage";
import LoginPage from "./pages/LoginPage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log("Hello salut Webpack Encore! Edit me in assets/js/app.js");

const App = () => {
    return (
        <HashRouter>
            <NavBar />

            <main className="container mt-5">
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
