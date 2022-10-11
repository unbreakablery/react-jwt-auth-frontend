import React from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import DocCard from "../components/DocCard";
import useCurrentUser from "../hooks/useCurrentUser";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DocList() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
    
  useEffect(() => {
    if (!currentUser || currentUser === {}) {
      navigate("/login");
    }
    
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    
    try {
      axios.get(`${BASE_URL}/doc`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.accessToken
        }
      }).then((result) => {
        setDocs(result.data);
      }).catch((err) => {
        setDocs([]);
      });
    } catch (err) {
      setDocs([]);
    }
  }, []);

  return (
    <>
    {(docs && docs.length > 0) ? (
      <Container style={{margin:"40px auto"}}>
        <Row style={{borderBottom:"3px solid black", marginBottom:"20px"}}>
          <Col md={4}><h4>Document Name</h4></Col>
          <Col md={4}><h4>Content</h4></Col>
          <Col md={4}><h4>Action</h4></Col>
        </Row>
        <Row>
          {docs.map((doc, index) => (
            <DocCard
              key={index}
              doc={doc}
            />
          ))}
        </Row>
        <Row className="text-center">
          <Col>
            <Button variant="dark"  style={{padding:"5px 40px"}} onClick={() => navigate('/')} >
                Main
            </Button>
          </Col>
        </Row>
      </Container>
      ) : (
      <Container>
        <Row>
          <Col>
            <h3 className="text-danger">No documents are in the database or Invaild Token</h3>
            <Button variant="dark" onClick={() => navigate('/')}>Main</Button>
          </Col>
        </Row>
      </Container>
      )
    }
    </>
  )
}

export default DocList;
