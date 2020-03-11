import React,{ useState, useContext} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Fields";

const LoginPage = ({ history}) => {
    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "test@hotmail.com",
        password: "password",
    });

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    const [error, setError] = useState("");

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await authAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Le nom d'utilisateur et le mot de passe ne correspondent pas");
        }
    };

    return (
        <>
            <h1>Connexion à l'app</h1>

            <form action="" onSubmit={handleSubmit}>
                <Field label={"Adresse email"} name={"username"} value={credentials.username}
                       placeholder={'Adresse email de Connexion'} onChange={handleChange} type={"email"} error={error}/>
                <Field label={"Mot de passe"} name={"password"} value={credentials.password} onChange={handleChange}
                       type={"password"} error={""}/>
                <div className="form-group">
                    <button type={"submit"} className={"btn btn-success"}>Se connecter</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;