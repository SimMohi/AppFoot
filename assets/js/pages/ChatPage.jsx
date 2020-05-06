import React, {useEffect, useState} from 'react';
import ChatAPI from "../services/ChatAPI";
import jwtDecode from "jwt-decode";
import Message from '../components/Chat/message';
require('../../css/Chat.css');

// import MessageList from '../components/Chat/MessageList';
// import SendMessageForm from '../components/Chat/SendMessageForm';

const ChatPage = () => {

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
        for (let i = 0; i < response.length; i++){
            channel.push({
                name: response[i]["channel"],
                id: response[i]["channelId"]
            });
            messagesArr.push({
                channelId: response[i]["channelId"],
                messages: response[i]["messages"]
            });
        }
        setMessages(messagesArr);
        setRooms(channel);
    }

    const changeRoom = (index) => {
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
            toast.error("Echec lors de l'envoi du message")
        }
    }

    const handleChange = ({currentTarget}) => {
        setNewMessage(currentTarget.value);
    }

    useEffect( () => {
        findChatInfo();
    }, []);
    return(
        <>
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
                        <div className="join-room">
                            &larr; Join a room!
                        </div>
                    </div>
                </>
            }
            <div className="message-list">
                {activeMessage.map((message, index) => {
                    {/*<Message key={message.id} username={message.senderId} text={message.text} />*/}
                    return(
                        <Message key={4} username={message.sender} text={message.text} />
                    )
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
        </>
    )
}

export default ChatPage;