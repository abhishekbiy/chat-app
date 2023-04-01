import React ,{useState , useEffect} from 'react';
import {Form , Button, Container, Row, Col} from 'react-bootstrap';
import { Link ,useNavigate } from 'react-router-dom';
import "./Login.css";
import {useDispatch , useSelector} from "react-redux";
import {  clearError, userLogin } from '../Redux/Action/UserAction';
import Carousel from 'react-bootstrap/Carousel';
import p1 from '../Images/p1.jpg';
import p2 from '../Images/p2.jpg';
import p3 from '../Images/p3.jpg';
// import login from '../Images/login-background.jpg';



const Login = () => {
  const [user, setuser] = useState({password: "" , email: ""});
  const {userData , error} = useSelector(state => state.userReducer)

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onChange = (e) => {
      setuser({...user , [e.target.name]:e.target.value});
  }
 
  const onSubmit = async (e) => { 
    e.preventDefault();
    dispatch(userLogin(user));
    // socket.emit("new-user")
    
  }
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  useEffect(() => {
    if(userData){
      navigate("/chat")
    } 
    // eslint-disable-next-line
  }, [userData])
  useEffect(() => {
    setTimeout(() =>{
      dispatch(clearError())
    }, 5000)
    // eslint-disable-next-line
  }, [error])
    return (
        <Container className='login'>
            <Row style={{height:'100vh'}}>
                <Col md={6}  className="loginBG" >
                <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={p1}
          alt="First slide"
        />
      
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={p2}
          alt="Second slide"
        />

       
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={p3}
          alt="Third slide"
        />

       
      </Carousel.Item>
    </Carousel>
                </Col>
                <Col md={1}>
                </Col>
                <Col md={5} className='loginBox' >
                <Form style={{width:"80%", maxWidth:500}} onSubmit={onSubmit} >
                  {error && <div className='alert alert-danger' > {error}</div>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={onChange} name="email" value={user.email}  />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
    
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password"  onChange={onChange} name="password" value={user.password} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div className='py-4' >
                <p className="text-center">
                    Don't have an Account? <Link to="/signup" >Register</Link>
                </p>
          </div>
        </Form>
                </Col>

            </Row>
        </Container>
       
      );
}

export default Login;