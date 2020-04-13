import React, {useEffect, useState} from 'react';
import authAPI from "../services/authAPI";

const ProfilPage = () => {

    const [userConnected, setUserConnected] = useState({});
    const getUserConnected = async () => {
        try{
            const userInfo = await authAPI.getUserInfo();
            setUserConnected(userInfo[0]);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect( () => {
        getUserConnected();
    }, []);

    console.log(userConnected);

    return(
        <>


        </>
    );
}

export default ProfilPage;