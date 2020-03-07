import React,{ useState} from 'react';
import axios from 'axios';
import usersAPI from "../services/usersAPI";

const LoginPage = props => {
    const [credentials, setCredentials] = useState({
        username: "test",
        password: "aaa",
    });

    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({ ...credentials, [name]: value });
    };

    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = await axios
                .post("http://localhost:8000/api/login_check", credentials)
                .then(response => response.data.token);
            setError("");

            window.localStorage.setItem("token", token);
            axios.defaults.headers["Authorization"] = "Bearer " + token;

        } catch (e) {
            setError("Le nom d'utilisateur et le mot de passe ne correspondent pas");
        }
        console.log(credentials);
    }

    return (
        <>
            <h1>Connexion à l'app</h1>

            <form action="" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse Email</label>
                    <input type="email" className={"form-control" + (error && " is-invalid")} placeholder={"Adresse email de Connexion"} name={"username"} id={"username"}
                           value={credentials.username} onChange={handleChange}/>
                    { error && <p className={"invalid-feedback"}>{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" placeholder={"Mot de passe"} name={"password"} id={"password"} className={"form-control"}
                           value={credentials.password} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <button type={"submit"} className={"btn btn-success"}>Se connecter</button>
                </div>
            </form>
        </>
    ) ;
};
        export default LoginPage;