import React, {useContext, useEffect, useState} from "react";
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import usersAPI from "../services/usersAPI";

const RGPDPage = (props)=> {

    const {id} = props.match.params;
    const {setIsAuthenticated} = useContext(AuthContext);
    const [user, setUser] = useState({});

    const handleLogout = () => {
        window.location.href = '#/login';
    };

    const fetchUser = async () => {
        const resp = await usersAPI.find(id);
        setUser(resp);
    }

    const accept = async () => {
        let copy = JSON.parse(JSON.stringify(user));
        copy["address"] = copy['address']["@id"];
        copy["rgpd"] = true;
        try{
            await usersAPI.update(id, copy);
            setIsAuthenticated(true);
            window.location.href = '#/';
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <div className={"overflow-auto"} style={{height: 600}}>
                <h1 className={"text-center mb-5"}>Politique de confidentialité</h1>
                <h3>1. Traitement des données personnelles</h3>
                <p>L‘utilisation du site par les utilisateurs pourra entraîner la communication de données
                personnelles. Le traitement de ces données par les responsables sera conforme à la Loi et au
                Règlement. </p>
                <h3>2. Données personnelles susceptibles d'être traitées</h3>
                <p>L'Utilisateur consent, lors de la visite et lors de l'utilisation du site, que le site recueille et traite,
                selon les modalités et principes décrits dans la présente Politique de confidentialité, les
                    données à caractère personnel suivantes :</p>
                <ul>
                    <li>Votre adresse mail
                    </li>
                    <li>Nom</li>
                    <li>Prénom</li>
                    <li>Adresse</li>
                    <li>Numéro de téléphone</li>
                </ul>
                <h3>3. Consentement</h3>
                <p>En partageant son Email, l'Utilisateur déclare avoir pris connaissance et marque son accord de
                façon libre, spécifique, éclairée et univoque au traitement des données à caractère personnel
                le concernant. Cet accord porte sur le contenu de la présente Politique de confidentialité.
                Le consentement est donné par l'acte positif par lequel l‘Utilisateur a coché la case proposant la
                Politique de confidentialité en lien hypertexte.Ce consentement est une condition indispensable
                pour effectuer certaines opérations sur le site ou pour permettre à l'utilisateur d‘entrer en
                relation contractuelle avec le responsable. Tout contrat liant le responsable et un utilisateur
                portant sur les services et biens proposés sur le site est subordonné à l‘acceptation de la
                Politique de confidentialité parl'Utilisateur.
                L'Utilisateur consent à ce que le Responsable du Traitement traite et recueille, conformément
                aux modalités et principes compris dans la présente Politique de confidentialité, ses données à
                caractère personnel qu'il communique sur le Site pour les légalités indiquées plus haut.
                L'Utilisateur a le droit de retirer son consentement à tout moment. Le retrait du consentement
                    ne compromet pas la licéité du traitement fondé sur le consentement préalablement donné.</p>
                <h3>4. Durée de conservation des données personnelles</h3>
                <p>Conformément à l'article 13 52 du Règlement et de la Loi, le Responsable du Traitement ne
                conserve les données à caractère personnel que pendant le temps raisonnablement
                nécessaire pour permettre l’accomplissement des légalités pour lesquelles elles sont traitées.
                Les données personnelles peuvent être transmises aux préposés, collaborateurs, sous—traitants
                ou fournisseurs qui offrent des garanties de sécurité des données adéquates, et qui collaborent
                    dans le cadre de la commercialisation de produits ou de la fourniture de services.</p>
                <h3>5. Droits des Utilisateurs</h3>
                <p>A tout moment, l'Utilisateur peut exercer ses droits en envoyant un message par courrier
                    électronique à l'adresse suivante : info@fcronvauchaumont.be</p>
            </div>
            <div className="mt-5 float-right">
                <button className={"btn btn-lg btn-warning mr-5"} onClick={accept}>Accepter</button>
                <button className={"btn btn-lg btn-danger mr-5"} onClick={handleLogout}>Refuser</button>
            </div>

        </div>
    )
}

export default RGPDPage

