import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function NavbarMenue() {
  const navigate  = useNavigate()
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand  onClick={() => navigate('/')}>Awsome Editor</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/create')}>Create Document</Nav.Link>
            <Nav.Link onClick={() => navigate('/docs')}>All Documents</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarMenue;


