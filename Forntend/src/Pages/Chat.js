import React , {useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MessageForm from '../Components/MessageForm';
import Sidebar from '../Components/Sidebar';
import {useSelector , useDispatch} from "react-redux"
import { addError, clearError, authUser } from '../Redux/Action/UserAction';
import {useNavigate} from "react-router-dom";

const Chat = () => {
    const {userData , error} = useSelector(state=>state.userReducer);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
       dispatch(authUser())
       // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(!userData){
            dispatch(addError("Login is required"));
          navigate("/login")
        } 
        // eslint-disable-next-line
      }, [userData])
      useEffect(() => {
        setTimeout(() =>{
          dispatch(clearError())
        }, 5000)
        // eslint-disable-next-line
      }, [error])
  
    return (<Container>
        <Row>
            <Col md={4}>
                <Sidebar/>
            </Col>
            <Col md={8} >
                <MessageForm/>
            </Col>
        </Row>
    </Container>)
}


export default Chat;