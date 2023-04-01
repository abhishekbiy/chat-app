import React from 'react';
import {Nav , Navbar , Container , NavDropdown , Button} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import logo from '../Images/logo.png';
import {useDispatch , useSelector} from "react-redux";
import { userLogout } from '../Redux/Action/UserAction';
import {useNavigate} from 'react-router-dom';

const Navigation = () => {
  const {userData} = useSelector(state => state.userReducer)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async()=>{
    dispatch(userLogout(userData))
    navigate("/login")
  }

    return (<Navbar bg="dark" expand="sm" variant='dark'>
    <Container>
        <LinkContainer to='/'>
        <Navbar.Brand ><img src={logo} alt="Logo" style={{width:50 , height:50}} />Chat App</Navbar.Brand>
        </LinkContainer>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
         <LinkContainer to="/chat" >
            <Nav.Link>Chat</Nav.Link>
         </LinkContainer>
         { !userData && <LinkContainer to="/login" >
            <Nav.Link>Login</Nav.Link>
         </LinkContainer>} 
        
          {userData && <NavDropdown title={<>
                      <img src={userData.picture} alt="profile-pic" style={{width:30 , height:30 , borderRadius:"50%", marginRight:10 , objectFit:"cover"}} />
                      {userData.name}
                      </>} id="basic-nav-dropdown">

            <div className='text-center'>
              <Button onClick={logout} variant='danger'  >
                         Logout
                         </Button>
            </div>
          </NavDropdown>}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>)
}


export default Navigation;