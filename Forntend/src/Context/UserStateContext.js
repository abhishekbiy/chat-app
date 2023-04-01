import React, { useState } from "react";
import createdContext from "./UserCreateContext";
import { io } from "socket.io-client";
import { BASE_URL } from "../Utils/ConstData";

const UserStateContext = (props) => {
  const socket = io(BASE_URL,{
    withCredentials: true,
    transportOptions: {
      polling: {
        extraHeaders: {
          "my-custom-header": "abcd"
        }
      }
    }
  });

  const [rooms, setrooms] = useState([]);
  const [currRoom, setcurrRoom] = useState([]);
  const [members, setmembers] = useState(null);
  const [messages, setmessages] = useState([]);
  const [privateMemberMsg, setprivateMemberMsg] = useState({});
  const [newMessages, setnewMessages] = useState({});

  return (
    <createdContext.Provider
      value={{
        socket,
        rooms,
        setrooms,
        currRoom,
        setcurrRoom,
        members,
        setmembers,
        messages,
        setmessages,
        privateMemberMsg,
        setprivateMemberMsg,
        newMessages,
        setnewMessages,
      }}
    >
      {props.children}
    </createdContext.Provider>
  );
};

export default UserStateContext;
