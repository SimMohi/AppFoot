import React, {useEffect, useState} from 'react';
import PhotosApi from "../services/PhotosApi";
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";
import usersAPI from "../services/usersAPI";
import authAPI from "../services/authAPI";

const FolderPage = props => {

    const {id} = props.match.params;
    const [reload, setReload] = useState(0);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [photos, setPhotos] = useState([{path: ""}]);
    const [imageSelect, setImageSelect] = useState([]);
    const [modal2, setModal2] = useState(false);
    const [modalPh, setModalPh] = useState("");
    const isAdmin = authAPI.getIsAdmin();
    const [show2, setShow2] = useState(false);

    const findPhotos = async () => {
        const response = await PhotosApi.getFolderPhotos(id);
        setName(response.data.name);
        setPhotos(response.data.photos);
    }

    const imageSelected = event => {
        let images = event.target.files;
        let realImages = [];
        for (let i=0; i< images.length; i++){
            if(images[i].type == "image/png" || images[i].type == "image/jpg" || images[i].type == "image/jpeg") {
               realImages.push(images[i]);
            }
        }
        setImageSelect(realImages);
    }

    const submit = async () => {
        console.log(imageSelect);
        const fd = new FormData();
        fd.append('id', id);
        for (let i=0; i< imageSelect.length; i++){
            fd.append('image'+i, imageSelect[i]);
            fd.append("num", i+1);
        }
        const response = await PhotosApi.addPhotos(fd);
        setShow(false);
        setReload(reload+1);
    }

    const clickIm = (i) =>{
        setModal2(true);
        setModalPh(photos[i].path);
    }

    const remFolder = async () => {
        await PhotosApi.removeFolder(id);
        props.history.replace("/photos");
    }

    const deletePh = async (id) => {
        await PhotosApi.removePhoto(id);
        setReload(reload+1);
    }

    useEffect( () => {
        findPhotos();
    }, [id, reload]);

    return(
        <>
            <h1 className={"text-center"}>Photos du dossier {name}</h1>
            {isAdmin &&
            <div className="d-flex flex-row-reverse">
                <button onClick={() => setShow(true)} className="btn btn-warning btn-lg mb-3 "><i
                    className="fas fa-plus"></i></button>
            </div>
            }
            <div className={" whiteBorder d-flex justify-content-center"}>
                {photos.map((p, index)=>
                    <div key={index} className={"m-3 d-flex flex-column"}>
                        {isAdmin &&
                        <button onClick={() => deletePh(p.id)} className="btn btn-danger align-self-start btn-sm">X</button>
                            }
                        <img className={"littleImage"} src={p.path} alt="" />
                    </div>
                )}
            </div>
            {isAdmin &&
            <div className="d-flex flex-row-reverse">
                <button onClick={()=>setShow2(true)} className="btn btn-danger mt-5 btn-lg mb-3 ">Supprimer le dossier</button>
            </div>
            }
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Ajouter des photos
                </Modal.Header>
                <Modal.Body className={""}>
                    <input type="file"  onChange={imageSelected} multiple={true}/>
                    <ul>
                        <li>.png ou .jpeg ou .jpg</li>
                    </ul>
                    <div className="d-flex flex-row-reverse">
                        <button onClick={submit} className="btn btn-danger ml-auto">Ajouter</button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal className={"modalPhoto"} show={modal2} onHide={() => setModal2(false)}>
                    <div className={"m-3"}>
                        <img className={"littleImage"} src={modalPh} alt="" />
                    </div>
            </Modal>
            <Modal show={show2} onHide={() => setShow2(false)}>
                <Modal.Body className={"text-danger"}>
                    <h6>Etes vous sûr de vouloir supprimer ce dossier ? </h6>
                    <h6>Cette action est irréversible. Les photos seront perdues.</h6>
                    <div className="d-flex flex-row-reverse">
                        <button onClick={remFolder} className="btn btn-danger ml-auto">Supprimer</button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal className={"modalPhoto"} show={modal2} onHide={() => setModal2(false)}>
                <div className={"m-3"}>
                    <img className={"littleImage"} src={modalPh} alt="" />
                </div>
            </Modal>
        </>
    )
}

export default FolderPage;