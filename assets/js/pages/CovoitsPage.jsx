import React, { useState } from 'react';
import {Link} from "react-router-dom";

const CovoitsPage = props => {

    const [show, setShow] = useState(false);

    return(
        <>
            <h1>Espace covoiturage </h1>
            <Link to={"/covoit/new/"} className={"btn btn-info float-right"}>Nouveau covoiturage</Link>
        </>

    )
}

export default CovoitsPage;