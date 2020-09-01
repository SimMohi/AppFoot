import React, {useEffect, useState} from 'react';
import PhotosApi from "../services/PhotosApi";
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";
import {Link} from "react-router-dom";
import authAPI from "../services/authAPI";

const PhotosPage = props => {

    const [teams, setTeams] = useState([]);
    const [show, setShow] = useState(false);
    const [newFolder, setNewFolder] = useState("");
    const [reload, setReload] = useState(0);
    const isAdmin = authAPI.getIsAdmin();

    const findPhotos = async () => {
        const response = await PhotosApi.getAllPhotos();
        setTeams(response.data);
    }

    const onChangeNF = ({currentTarget}) => {
        setNewFolder(currentTarget.value);
    }

    const createFolder = async ()=> {
        await PhotosApi.createFolder({name: newFolder});
        setReload(reload+1);
        setShow(false);
    }


    useEffect( () => {
        findPhotos();
    }, [reload]);

    return(
        <>
            <h1 className={"text-center"}>Photos</h1>
            {isAdmin &&
            <div className="d-flex flex-row-reverse">
                <button onClick={() => setShow(true)} className="btn btn-warning btn-lg mb-3 "><i
                    className="fas fa-plus"></i></button>
            </div>
            }
            <div className={"row whiteBorder d-flex justify-content-center"}>
                {teams.map((t, index) =>
                    <div>
                        <Link key={index} to={"/photos/"+ t.id}>
                            <div  className={"m-5"}>
                                <div className="col">
                                    <img src="img/folder.png" className={"folder"} alt="folder"/>
                                    <h5 className={"text-danger mt-3 text-center"}>{t.name}</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
            {isAdmin &&
            <div className="d-flex flex-row-reverse">
                <Link to={"photosAut"} className={" mt-3 btn btn-danger"}> Autorisations</Link>
            </div>
            }
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Créer un dossier
                </Modal.Header>
                <Modal.Body className={""}>
                    <Field name={"name"} placeholder={"Nom du dossier"} onChange={onChangeNF} value={newFolder} type={"text"} label={"Nom"}/>
                    <div className="d-flex flex-row-reverse">
                        <button onClick={createFolder} className="btn btn-danger ml-auto">Créer</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PhotosPage;