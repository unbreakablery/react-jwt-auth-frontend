import React from 'react'
import { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import useCurrentUser from '../hooks/useCurrentUser';
function Main() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser === {}) {
      navigate("/login");
    }
  }, []);
  
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <Container style={{background: "rgb(91 103 131)", color:"white", margin:"100px auto ", height:"300px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <Row style={{textAlign:"center", }}>
        <h1>Welcome to Awsome Text Editor</h1>
      </Row>
      <Row >
        <Col>
          <Button className="m-4" variant="dark" onClick={() => navigate('/create')}>Create Document</Button>
          <Button variant="dark" onClick={() => navigate('/docs')}>All Documents</Button>
          {currentUser &&
            <Button className="m-4" variant="dark" onClick={logout}>Logout</Button>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Main
