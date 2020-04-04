import React, { useState } from 'react';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CovoitPage from "./CovoitPage";

const CovoitsPage = props => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <>
            <h1>Espace covoiturage </h1>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nouveau covoiturage</Modal.Title>
                </Modal.Header>
                <Modal.Body><CovoitPage id={4}/></Modal.Body>
            </Modal>
        </>
    )
}

export default CovoitsPage;