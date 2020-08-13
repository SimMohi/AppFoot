import React, { useState } from "react";
import Field from "./../components/forms/Fields";
import { Link } from "react-router-dom";
import UsersAPI from "../services/usersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm =
                "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            return;
        }

        try {
            await UsersAPI.create(user);
            setErrors({});

            toast.success(
                "Vous êtes désormais inscrit, vous pouvez vous connecter !"
            );
            history.replace("/login");
        } catch (error) {
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreurs dans votre formulaire !");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="whiteBorder p-5 col-6">
                    <h1>Inscription</h1>
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="firstName"
                            label="Prénom"
                            placeholder="Votre prénom"
                            error={errors.firstName}
                            value={user.firstName}
                            onChange={handleChange}
                        />
                        <Field
                            name="lastName"
                            label="Nom de famille"
                            placeholder="Votre nom de famille"
                            error={errors.lastName}
                            value={user.lastName}
                            onChange={handleChange}
                        />
                        <Field
                            name="email"
                            label="Adresse email"
                            placeholder="Votre adresse email"
                            type="email"
                            error={errors.email}
                            value={user.email}
                            onChange={handleChange}
                        />
                        <Field
                            name="password"
                            label="Mot de passe"
                            type="password"
                            placeholder="Votre mot de passe ultra sécurisé"
                            error={errors.password}
                            value={user.password}
                            onChange={handleChange}
                        />
                        <Field
                            name="passwordConfirm"
                            label="Confirmation de mot de passe"
                            type="password"
                            placeholder="Confirmez votre super mot de passe"
                            error={errors.passwordConfirm}
                            value={user.passwordConfirm}
                            onChange={handleChange}
                        />
                        <div className="form-group">
                            <div className={"custom-control custom-checkbox mb-3"}>
                                <input type="checkbox" className="custom-control-input" id={"All"}/>
                                <label className="custom-control-label" htmlFor={"All"}>En soumettant ce formulaire, j'accepte que les informations saisies soient expoitées</label>
                            </div>
                            <button type="submit" className="btn btn-danger">
                                Confirmation
                            </button>
                            <Link to="/login" className="btn text-warning">
                                J'ai déjà un compte
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default RegisterPage;