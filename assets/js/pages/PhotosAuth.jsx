import React, {useEffect, useState} from 'react';
import PhotosApi from "../services/PhotosApi";
import DateFunctions from "../services/DateFunctions";

const PhotosAuth = props => {

    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [reload, setReload] = useState(0);

    const findAuth = async () => {

        const response = await PhotosApi.getAllowPhotos();
        setUsers(response.data.user);
        setTeams(response.data.team)
    }

    const findTeam =  async ({ currentTarget }) => {
        if (currentTarget.value == 0) {
            setReload(reload+1);
        }
        const response = await PhotosApi.getAllowPhotosT(currentTarget.value);
        setUsers(response.data);
    }


    useEffect( () => {
        findAuth();
    }, [reload]);


    return(
        <>
            <div className="row">
                <div className="col-7">
                    <table className="table table-hover whiteBorder container p-3">
                        <thead>
                        <tr className={"row p-3"}>
                            <th className={"col-4"}></th>
                            <th className={"col-6"}>Nom</th>
                            <th className={"col-2"}>A accepté</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u, index) =>
                            <tr className={"row pl-3 pr-3"}>
                                <td className={"col-4"}>
                                    <img className={"rounded-circle profilePhotoLittle account-img"} src={u.path} alt=""/>
                                </td>
                                <td className={"col-6"}>
                                    {u.name}
                                </td>
                                <td className={"col-2"}>{u.accept &&
                                <i className="fas fa-check"></i>
                                ||
                                <i className="fas fa-times"></i>
                                }</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="col-3 ml-5">
                    <h6 className={"m-3"}>Sélectionner une équipe</h6>
                    <select className="form-control w-50" id="team" name={"team"} onChange={findTeam}>
                        <option value={0}>Toutes</option>
                        {teams.map((t,index) =>
                            <option key={index} value={t.id}>{t.name}</option>
                        )}
                    </select>
                </div>
            </div>

        </>)
}

export default PhotosAuth;