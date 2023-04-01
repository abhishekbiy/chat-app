import React , {useEffect} from 'react';
import {Row , Col , Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {useDispatch , useSelector} from "react-redux";
import { authUser } from '../Redux/Action/UserAction';
import {useNavigate} from 'react-router-dom';
import "./Home.css";

const Home = () => {
    const {error,userData} = useSelector(state =>state.userReducer)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
       dispatch(authUser())
       // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if(!userData){
            navigate("/login")
        }
        // eslint-disable-next-line
     }, [])

    if(error){
        console.log(error);
    }

    return (<> {userData && <><Row>
                <div style={{height:"100vh"}} className="d-flex flex-column align-items-center justify-content-center ">
                    <h1>
                        Welcome Back! {userData.name}
                    </h1>
                    <LinkContainer to="/chat">
                    <Button variant='success'>Chats<i className='fas fa-comments home-message-icon '></i></Button>
                    </LinkContainer>
                </div>
        </Row></>}
    </>
       
    )
}

export default Home;