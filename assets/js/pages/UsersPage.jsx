import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(0);
    const [checkbox, setCheckBox] = useState([false]);

    const findUsers = async () => {
        try {
            const data = await usersAPI.findAll();
            let check = [];
            for (let i = 0; i < data.length; i++){
                if (data[i]["roles"].includes("ROLE_ADMIN")){
                    check.push(true);
                } else {
                    check.push(false);
                }
            }
            setCheckBox(check);
            setUsers(data);
        } catch (error) {
            console.log(error.response);
        }
    }


    const handleDelete = id => {
        const originalUsers = [...users];
        setUsers(users.filter(user => user.id !== id));
        try {
            usersAPI.deleteUser(id);
        } catch (error) {
            setUsers(originalUsers);
        }
    };

    const Accept = async (id) => {
        let acceptedUser = users.filter(user => user.id == id);
        acceptedUser = acceptedUser[0];
        let copyAcceptedUser = JSON.parse(JSON.stringify(acceptedUser));
        copyAcceptedUser["isAccepted"] = true;
        try{
            await usersAPI.update(id, copyAcceptedUser);
        }catch (e) {
            console.error(e);
        }
        setReload(reload+1);
    }

    const changeRole = async (index) => {
        let copyUser = JSON.parse(JSON.stringify(users[index]));
        let originalCheckbox = JSON.parse(JSON.stringify(checkbox));
        let copyCheckbox = JSON.parse(JSON.stringify(checkbox));
        if (checkbox[index] == true){
            copyUser["roles"] = copyUser["roles"].filter(role => role !== "ROLE_ADMIN");
        } else {
            copyUser["roles"].push("ROLE_ADMIN");
        }
        copyCheckbox[index] = !copyCheckbox[index];
        setCheckBox(copyCheckbox);
        try{
            await usersAPI.update(copyUser.id, copyUser);
        } catch (e) {
            setCheckBox(originalCheckbox);
            console.error(e);
        }
    }


    useEffect( () => {
        findUsers();
    }, [reload]);


    return(
        <>
            <h1>Liste des utilisateurs</h1>
            <div className="row justify-content-center">

                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
                    <table className="table table-hover">
                        <thead className="bg-light">
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Est accepté ?</th>
                            <th className="text-center">Est admin</th>
                            <th className="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) =>
                            <tr key={user.id}>
                                <td>{user.lastName}</td>
                                <td>{user.firstName}</td>
                                <td className="text-center">{user.email}</td>
                                <td className="text-center">{user.isAccepted && <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}</td>
                                <td className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" checked={checkbox[index]} onChange={() => changeRole(index)} id={"adminCheck"+index}/>
                                    <label className="custom-control-label" htmlFor={"adminCheck"+index}></label>
                                </td>
                                <td className="text-center">
                                    {user.isAccepted == false &&
                                    <>
                                        <button onClick={() => Accept(user.id)}
                                                className="btn btn-sm btn-success mr-3">Accepter</button>
                                        <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                    </>
                                    ||
                                    <>
                                        <button onClick={() => Accept(user.id)}
                                                className="btn btn-sm btn-success mr-3" disabled={true}>Accepter</button>
                                        < button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                    </>
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default UsersPage;