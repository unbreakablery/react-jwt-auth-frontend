import React from 'react'
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const login = async (e) => {
    axios.get(`${baseUrl}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        email: email,
        password: password
      }
    }).then((result) => {
      localStorage.setItem('user', JSON.stringify(result.data));
      navigate('/');
    }).catch((err) => {
      setErrorMessage(err.response.data.message);
    });
  }

  return (
    <Container style={{background: "rgb(91 103 131)", color:"white", margin:"100px auto ", height:"300px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      {errorMessage &&
        <Row style={{textAlign:"center", }}>
          <h3 className='text-danger'>{errorMessage}</h3>
        </Row>
      }
      <Row style={{textAlign:"center", }}>
          <h1>Login</h1>
      </Row>
      <Row>
        <Col>
          <label htmlFor="email">Email: </label><br />
          <input type="text" name="email" value={email} onChange={changeEmail} placeholder="Your Email" />
        </Col>
        <Col>
          <label htmlFor="password">Password: </label><br />
          <input type="password" name="password" value={password} onChange={changePassword} placeholder="Your Password" />
        </Col>
      </Row>
      <Row >
        <Col>
          <Button className="m-4" variant="dark" onClick={login}>Login</Button>
          <Button variant="dark" onClick={() => navigate('/signup')}>SignUp</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
