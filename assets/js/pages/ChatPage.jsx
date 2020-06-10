import React, {useEffect, useState, useRef} from 'react';
import ChatAPI from "../services/ChatAPI";
import jwtDecode from "jwt-decode";
import DateFunctions from "../services/DateFunctions";
import useInterval from "../components/UseInterval";

require('../../css/Chat.css');


const ChatPage = () => {

    let [count, setCount] = useState(0);

    const userId = getId();
    const [activeRoom, setActiveRoom] = useState({
        id: null,
        name: ""
    })
    const [rooms, setRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeMessage, setActiveMessage] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [reload, setReload] = useState(0);

    function getId () {
        const token = window.localStorage.getItem(("authToken"));
        if (token){
            const { id } = jwtDecode(token);
            return id;
        }
        return 0;
    }

    const findChatInfo = async () => {
        const response = await ChatAPI.getChatInfo(userId);
        let channel = [];
        let messagesArr = [];
        let selectRoom = {};
        for (let i = 0; i < response.length; i++){
            if (i == 0){
                selectRoom ={
                    id: response[i]["channelId"],
                    name: response[i]["channel"]
                }
            }
            channel.push({
                name: response[i]["channel"],
                id: response[i]["channelId"]
            });
            messagesArr.push({
                channelId: response[i]["channelId"],
                messages: response[i]["messages"]
            });
        }
        for (let i = 0; i < messagesArr.length; i++){
            if (messagesArr[i]["channelId"] == selectRoom.id){
                setActiveMessage(messagesArr[i]["messages"]);
            }
        }
        const objDiv = document.getElementById("message-list");
        objDiv.scrollTop = objDiv.scrollHeight;
        setDisabled(false);
        setActiveRoom(selectRoom);
        setMessages(messagesArr);
        setRooms(channel);
    }

    const changeRoom = (index) => {
        const objDiv = document.getElementById("message-list");
        objDiv.scrollTop = objDiv.scrollHeight;
        for (let i = 0; i < messages.length; i++){
            if (messages[i]["channelId"] == rooms[index]["id"]){
                setActiveMessage(messages[i]["messages"]);
            }
        }
        setActiveRoom({
            id: rooms[index]["id"],
            name: rooms[index]["name"]
        })
        setDisabled(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let post = {
            message: newMessage,
            userId: userId,
            teamId: activeRoom.id
        }
        try{
            await ChatAPI.sendMessage(post);
        } catch (e) {
            toast.error("Echec lors de l'envoi du message");
        }
        setReload(reload+1);
        setNewMessage("");
    }

    const handleChange = ({currentTarget}) => {
        setNewMessage(currentTarget.value);
    }

    const getNewMessage = async () =>{
        const response = await ChatAPI.getChatInfo(userId);
        let messagesArr = [];
        for (let i = 0; i < response.length; i++){
            messagesArr.push({
                channelId: response[i]["channelId"],
                messages: response[i]["messages"]
            });
        }
        for (let i = 0; i < messagesArr.length; i++){
            if (messagesArr[i]["channelId"] == activeRoom.id){
                setActiveMessage(messagesArr[i]["messages"]);
                const objDiv = document.getElementById("message-list");
                objDiv.scrollTop = objDiv.scrollHeight;
            }
        }
    }

    useEffect(  () => {
        findChatInfo();
    }, [reload]);

    useInterval(() => {
        getNewMessage();
    }, 10000);

    return(
        <div id="root">
            <div className="app whiteBorder">
                <div className="rooms-list">
                    <ul>
                        <h3>Vos Salons</h3>
                        {rooms.map((r, index) => {
                            const active = r.id === activeRoom.id ? 'active' : '';
                            return (
                                <li key={r.id} className={"room " + active}>
                                    <a onClick={() => (changeRoom(index))}>
                                        # {r.name}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {(activeRoom.id == null) &&
                <>
                    <div className="message-list">
                        <div className="join-room bg-danger">
                            Choissisez un salon
                        </div>
                    </div>
                </>
                }
                <div className="message-list" id={"message-list"}>

                    {activeMessage.map((message, index) => {
                        if (message["senderId"] == userId){
                            return(
                                <div key={index} className="message d-flex flex-row-reverse">
                                    <div>
                                        <div className="message-username text-right mr-3" >{DateFunctions.dateFormatFrDMHM(message.date)}</div>
                                        <div className="message-text myMessage mr-3">{message.text}</div>
                                    </div>
                                </div>
                            )
                        } else {
                            return(
                                <div key={index} className="message">
                                    <div className="message-username" >{message.sender} {DateFunctions.dateFormatFrDMHM(message.date)}</div>
                                    <div className="message-text">{message.text}</div>
                                </div>
                            )
                        }
                    })}
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="send-message-form">
                    <input
                        disabled={disabled}
                        onChange={handleChange}
                        value={newMessage}
                        placeholder="Ecrivez votre message"
                        type="text" />
                </form>
            </div>
        </div>
    )
}

export default ChatPage;