import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Link} from "react-router-dom";
import authAPI from "../services/authAPI";
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";

const ConfidentialPage = props => {

    const [show, setShow] = useState(false);
    const [photos, setPhotos] = useState(false);
    const [select, setSelect] = useState(1);

    const changeSelect = ({currentTarget}) => {
        setSelect(currentTarget.value);
    }

    const getParam = async () =>{
        const id = authAPI.getId();
        const {rgpdVisibleStaff, rgpdVisibleAll, rgdpPhotos} = await usersAPI.find(id);
        setPhotos(rgdpPhotos);
        if (rgpdVisibleStaff == false){
            setSelect(1);
        } else if (rgpdVisibleStaff == true && rgpdVisibleAll == false) {
            setSelect(2);
        } else if (rgpdVisibleAll == true) {
            setSelect(3);
        }
    }


    const submit = async () => {
        const id = authAPI.getId();
        const post = {
            id: id,
            photos: photos,
            select: select,
        }
        try{
            await usersAPI.postParam(post);
            toast.success("Paramètres enregistrés")
        } catch (e) {
            toast.error("Erreur lors de l'enregistrement des paramètres");
        }
    }

    const deleteUser = async () => {
        const id = authAPI.getId();
        await usersAPI.deleteUser(id);
    }

    useEffect( () => {
        getParam();
    }, []);

    return (
        <>
            <Link to={"/profil"} className={"btn btn-danger mr-3 mb-5"}><i className="fas fa-arrow-left"/></Link>
            <h3 className={"text-center"}> Paramètres de mon compte</h3>
            <div className="container">
                <div className="m-5 whiteBorder p-3">
                    <div className="form-group">
                        <span className={"mr-3"}>J'accepte que mon profil soit visible par </span>
                        <select className="custom-select w-50" value={select} onChange={changeSelect}>
                            <option value="1">Moi seulement</option>
                            <option value="2">Les membres du staff</option>
                            <option value="3">Les membres de l'application</option>
                        </select>
                    </div>
                    <hr/>
                    <div className={"custom-control custom-checkbox"}>
                        <input type="checkbox" className="custom-control-input" id={"All"} checked={photos} onChange={()=> setPhotos(!photos)}/>
                        <label className="custom-control-label" htmlFor={"All"}>
                            J'accepte que des photos de moi soient publiées au sein de l'application
                        </label>
                    </div>
                    <hr/>
                    <button className="btn btn-warning" >
                        Exporter mes informations personnelles (JSON)
                    </button>
                    <hr/>

                    <button className="btn btn-danger" onClick={()=> setShow(true)}>
                        Supprimer mon profil
                    </button>
                </div>
                <div className="float-right">
                    <button className="btn btn-warning" onClick={submit}>
                        Enregistrer
                    </button>
                </div>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Supprimer mon profil
                </Modal.Header>
                <Modal.Body className={""}>
                    <div>
                        <div className={"text-danger"}>
                            <p>Êtes vous sûr, de vouloir supprimer votre profil ? <br/>
                                Toutes vos informations seront perdues. <br/> </p>
                            <p> Vous serez déconnecter de l'application et vous n'aurez plus la possibilité de vous reconnecter à ce compte. </p>
                        </div>
                    </div>
                    <button onClick={deleteUser} className="btn btn-danger">
                        Oui, je suis sûr
                    </button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ConfidentialPage;