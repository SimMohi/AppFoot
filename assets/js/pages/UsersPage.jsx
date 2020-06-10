import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [reload, setReload] = useState(0);
    const [checkbox, setCheckBox] = useState([false]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState({
        id: '',
        name: '',
    })

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
            setAllUsers(data);
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
        setShow(false);
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

    const openModal = (user) => {
        setSelectedUser({
            id: user.id,
            name: user.firstName + " " + user.lastName,
        })
        setShow(true);
    }

    const changeSearch = ({ currentTarget }) => {
        const value = currentTarget.value;
        let filter = value.toLowerCase();
        let userArr = [];
        for (let i = 0; i < allUsers.length; i++) {
            let a = allUsers[i]["firstname"] + " " + allUsers[i]["lastName"];
            if (a.toLowerCase().indexOf(filter) > -1) {
                userArr.push(allUsers[i]);
            }
        }
        setUsers(userArr)
        setSearch(value);
    }

    useEffect( () => {
        findUsers();
    }, [reload]);

    return(
        <>
            <div className="row">
                <div className="col-6">
                    <h1 className={"mb-3"}>Liste des utilisateurs</h1>
                </div>
                <div className="col-2"></div>
                <div className="col-2">
                    <Field type={"text"} value={search} onChange={changeSearch} placeholder={"Trier par nom"}/>
                </div>
            </div>
            <table className="table table-hover whiteBorder">
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
                        {user.isAccepted &&
                        <td className="custom-control custom-checkbox text-center">
                            <input type="checkbox" className="custom-control-input" checked={checkbox[index]}
                                   onChange={() => changeRole(index)} id={"adminCheck" + index}/>
                            <label className="custom-control-label" htmlFor={"adminCheck" + index}></label>
                        </td>
                        ||
                        <td></td>
                        }
                        <td className="text-center">
                            {user.isAccepted == false &&
                            <>
                                <button onClick={() => Accept(user.id)}
                                        className="btn btn-sm btn-success mr-3">Accepter</button>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Refuser</button>
                            </>
                            ||
                            <>
                                <button onClick={() => Accept(user.id)}
                                        className="btn btn-sm btn-success mr-3" disabled={true}>Accepter</button>
                                <button onClick={() => openModal(user)} className="btn btn-sm btn-danger">Supprimer</button>
                            </>
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Body className={""}>
                    <h6>Etes vous sûr de vouloir supprimer l'utilisateur {selectedUser.name} ? </h6>
                    <h6>Cette action est irréversible.</h6>
                    <button onClick={() => handleDelete(selectedUser.id)} className="btn btn-danger float-right">Supprimer</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UsersPage;