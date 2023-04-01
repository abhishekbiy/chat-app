import React, { useContext, useEffect } from "react";
import { ListGroup, ListGroupItem ,Row , Col } from "react-bootstrap";
import { useSelector,useDispatch } from "react-redux";
import createdContext from "../Context/UserCreateContext";
import { resetNotification , addNotification } from "../Redux/Action/UserAction";
import { BASE_URL } from "../Utils/ConstData";
import "./Sidebar.css"

const Sidebar = () => {
  const context = useContext(createdContext);
  const {
    socket,
    setrooms,
    rooms,
    setcurrRoom,
    currRoom,
    setmembers,
    members,
    privateMemberMsg,
    setprivateMemberMsg,
  } = context;

  const { userData } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();


  useEffect(()=>{  
    if(userData){
    socket.emit("join-room", "general");
    socket.emit("new-user");
    getRooms();
    setcurrRoom("general");
  }
  // eslint-disable-next-line
  }, [])

  socket.off("new-user").on("new-user", (payload) => {
    setmembers(payload);
  });

  const joinRoom = (room , ispublic=true) => {
    dispatch(resetNotification(currRoom));
    socket.emit("join-room" , room, currRoom);
    setcurrRoom(room);
    if(ispublic){
      setprivateMemberMsg(null);
    }

  }
  socket.off("notifications").on("notifications", (room)=>{
    dispatch(addNotification(userData,room))
})

  const getPvtId = (a, b)=>{
    if(a>b){
      return a + '-' + b
    }else{
      return b  + '-' + a
    }

  }
  const joinPvtMsg = (member) => {
    setprivateMemberMsg(member);
    const roomId = getPvtId(userData._id,member._id);
    setcurrRoom(roomId)
    joinRoom(roomId , false);
  }
  
  const getRooms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/rooms`, {
                                            method: "GET",
                                            headers: { "content-type": "application/json" },
                                          });
      const data = await response.json();
      setrooms(data);
    } catch (error) {
      console.log(error);
    }

  };
  // const rooms = ["room 1" , "room 2" , "room 3" , "room 4"];
  return (
    <div>
      <h2>Availabe Rooms:</h2>
      <ListGroup>
        {rooms.map((room, i) => (
        <ListGroupItem onClick={()=>{joinRoom(room)}} key={i} active={room===currRoom} style={{ cursor: "pointer" }} > 
        {room}{" "}
        {currRoom !== room && userData?.newMessage?.[room] && <span className="badge rounded-pill bg-primary" > {userData?.newMessage?.[room]} </span>}
         </ListGroupItem>
        ))}
      </ListGroup>
      <h2>Members:</h2>
      <ListGroup>
        {members && members.map((member, i) => (
          <ListGroupItem key={member._id} active={privateMemberMsg?._id ===member?._id} onClick={()=>{joinPvtMsg(member)}} hidden={member?._id===userData?._id} style={{ cursor: "pointer" }}>
          <Row>
            <Col xs={2} className="member-status" >
                <img src={member.picture} alt="member-img" className="member-status-img" />
                {member.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i>: <i className="fas fa-circle sidebar-offline-status" ></i> }
            </Col>
            <Col xs={9} >
              {member.name}{" "}
              {member.status=== "offline" && "(Offline)"}
            </Col>
            <Col>
            {currRoom !== getPvtId(userData?._id , member?._id) && userData?.newMessage?.[getPvtId(userData?._id , member?._id)] && <span className="badge rounded-pill bg-primary" > {userData?.newMessage?.[getPvtId(userData?._id , member?._id)]} </span>}
            </Col>
          </Row>
            
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
