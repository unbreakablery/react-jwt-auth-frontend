import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUser from '../hooks/useCurrentUser';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const currentUser = useCurrentUser();
  if (currentUser) {
    navigate('/');
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const changeConfirmation = (e) => {
    setConfirmation(e.target.value);
  }

  const submitSignup = async () => {
    axios.post(`${baseUrl}/signup`, {
      'email': email,
      'password': password,
      'confirm_password': confirmation
    }).then((result) => {
      setIsSignedUp(true);
      setErrorMessage(result.data.message);
    }).catch((err) => {
      setIsSignedUp(false);
      setErrorMessage(err.response.data.message);
    });
  }

  return (
    <Container style={{background: "rgb(91 103 131)", color:"white", margin:"100px auto ", height:"300px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
        {errorMessage &&
          <Row style={{textAlign:"center", }}>
            <h3 className={isSignedUp ? 'text-success' : 'text-danger'}>{errorMessage}</h3>
          </Row>
        }
        <Row style={{textAlign:"center", }}>
            <h1>Sign Up</h1>
        </Row>
        <Row>
          <Col>
            <label htmlFor="email">Email:</label><br />
            <input type="text" name="email" value={email} onChange={changeEmail} />
          </Col>
          <Col>
            <label htmlFor="password">Password:</label><br />
            <input type="password" name="password" value={password} onChange={changePassword} />
          </Col>
          <Col>
            <label htmlFor="confirmation">Confirmation Password:</label><br />
            <input type="password" name="confirmation" value={confirmation} onChange={changeConfirmation} />
          </Col>
        </Row>
        <Row >
          <Col>
            <Button className="m-4" variant="dark" onClick={() => submitSignup()}>Submit</Button>
            <Button variant="dark" onClick={() => navigate('/login')}>Login</Button>
          </Col>
         </Row>
    </Container>
  )
}

export default Signup
