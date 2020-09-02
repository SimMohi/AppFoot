import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Field from "../components/forms/Fields";
import authAPI from "../services/authAPI";

const UsersPage = () => {
    const superAdmin = authAPI.getIsSuperAdmin();
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [reload, setReload] = useState(0);
    const [checkbox, setCheckBox] = useState([false]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState({
        id: '',
        name: '',
    })
    const [currentPage, setCurrentPage] = useState(1);
    const itemsMax = 10;
    const start = currentPage * itemsMax - itemsMax;
    const paginatedU = users.slice(start, start+ itemsMax);
    const pageC = Math.ceil(users.length/itemsMax);
    const pages = [];

    for (let i=1; i <= pageC; i++){
        pages.push(i)
    }

    const handleChangePage = (page) => {
        setCurrentPage(page);
    }

    const [errorFormat, setErrorFormat] = useState(false);
    const [file, setFile] = useState(null);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        lastName: "",
        firstName: "",
    });

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
    const fileSelec = event => {
        let newFile = event.target.files[0];
        console.log(newFile);
        setFile(newFile);
        const err = {};
        if(newFile.type != "text/csv") {
            setErrorFormat(true);
        } else {
            setErrorFormat(false);
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

    const addUser = async () => {

    }

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setNewUser({ ...newUser, [name]: value });
    };

    useEffect( () => {
        findUsers();
    }, [reload]);


    return(
        <>
            <div className="row">
                <div className="col-6">
                    <h1 className={"mb-3"}>Liste des utilisateurs</h1>
                </div>
            </div>
            <div className="row justify-content-end">
                <div className={"mr-5"}>
                    <Field type={"text"} value={search} onChange={changeSearch} placeholder={"Chercher par nom"}/>
                </div>
                <div className={"mt-4"}>
                    <button onClick={()=> setShow2(true)} className="btn btn-danger"><i className="fas fa-plus"></i></button>
                </div>
            </div>
            <table className="table table-hover whiteBorder">
                <thead className="bg-light">
                <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Est accepté ?</th>
                    {superAdmin &&
                        <th className="text-center">Est admin</th>
                    }
                    <th className="text-center"></th>
                </tr>
                </thead>
                <tbody>
                {paginatedU.map((user, index) =>
                    <tr key={user.id}>
                        <td>
                            <img className="rounded-circle profilePhotoLittle account-img" src={user.profilePic}/>
                        </td>
                        <td>{user.lastName}</td>
                        <td>{user.firstName}</td>
                        <td className="text-center">{user.email}</td>
                        <td className="text-center">{user.isAccepted && <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}</td>
                        {user.isAccepted &&
                          <>
                              {superAdmin &&
                                <td className="custom-control custom-checkbox text-center">
                                    <input type="checkbox" className="custom-control-input" checked={checkbox[index]}
                                           onChange={() => changeRole(index)} id={"adminCheck" + index}/>
                                    <label className="custom-control-label" htmlFor={"adminCheck" + index}></label>
                                </td>
                                  ||
                                  <td></td>
                              }
                        </>
                        ||
                        <td></td>
                        }
                        <td className="text-center">
                            {user.isAccepted == false &&
                            <>
                                <button onClick={() => Accept(user.id)}
                                        className="btn btn-sm btn-warning mr-3">Accepter</button>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Refuser</button>
                            </>
                            ||
                            <>
                                <button onClick={() => Accept(user.id)}
                                        className="btn btn-sm btn-warning  mr-3" disabled={true}>Accepter</button>
                                {superAdmin &&
                                <button onClick={() => openModal(user)}
                                        className="btn btn-sm btn-danger">Supprimer</button>
                                }
                            </>
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <div>
                <ul className="pagination ">
                    <li className={"page-item" + (currentPage == 1 && " disabled")}>
                        <button className="page-link " onClick={()=> handleChangePage(currentPage-1)}>&laquo;</button>
                    </li>
                    {pages.map((p, index) => (
                        <li key={index} className={"page-item" +  (currentPage === p &&" active")}>
                            <button className="page-link bg-danger text-white" onClick={() => handleChangePage(p)}>{p}</button>
                        </li>
                    ))}
                    <li className={"page-item" + (currentPage == pageC && " disabled")}>
                        <button className="page-link " onClick={()=> handleChangePage(currentPage+1)}>&raquo;</button>
                    </li>
                </ul>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Body className={""}>
                    <h6>Etes vous sûr de vouloir supprimer l'utilisateur {selectedUser.name} ? </h6>
                    <h6>Cette action est irréversible.</h6>
                    <button onClick={() => handleDelete(selectedUser.id)} className="btn btn-danger float-right">Supprimer</button>
                </Modal.Body>
            </Modal>
            <Modal show={show2} onHide={() => setShow2(false)}>
                <Modal.Header>
                    Création d'un nouvel utilisateur
                </Modal.Header>
                <Modal.Body className={""}>
                    <form onSubmit={addUser}>
                        <Field
                            name="lastName"
                            label="Nom"
                            type="text"
                            placeholder="Nom"
                            value={newUser.lastName}
                            onChange={handleChange}
                        />
                        <Field
                            name="firstName"
                            label="Prénom"
                            type="text"
                            placeholder="Prénom"
                            value={newUser.firstName}
                            onChange={handleChange}
                        />
                        <Field
                            name="email"
                            label="Adresse email"
                            placeholder="Adresse email"
                            type="email"
                            value={newUser.email}
                            onChange={handleChange}
                        />
                        <hr/>
                        <h6>OU</h6>
                        <input type={"file"} onChange={fileSelec}/>
                        {errorFormat &&
                        <p className={"text-danger"}>Le fichier doit être sous format .csv avec les colonnes nom, prénom et email</p>
                        ||
                        <p>Le fichier doit être sous format .csv avec les colonnes nom, prénom et email</p>
                        }
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-danger ml-auto" disabled={errorFormat}>
                                Créer
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UsersPage;