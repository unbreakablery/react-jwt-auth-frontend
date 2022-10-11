import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Row } from "react-bootstrap";
import { TrixEditor } from "react-trix";
import { io } from "socket.io-client";
import useCurrentUser from "../hooks/useCurrentUser";

const baseUrl = process.env.REACT_APP_BASE_URL;
const socket = io.connect(baseUrl);

function setInputText(text) {
    let element = document.querySelector("trix-editor");
    element.value = "";
    element.editor.setSelectedRange([0, 0]);
    element.editor.insertHTML(text);
}

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const [newDoc, setNewDoc] = useState({
      _id: location.state ? location.state.doc._id : '',
      name: location.state ? location.state.doc.name : '',
      html: location.state ? location.state.doc.html : '',
    });
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (text) => {
      setNewDoc((prev) => {
          return { ...prev, html:text}
      })
    }

    const handleUpdate = async() => {
      try{
        socket.emit('update', newDoc)
        await axios.put(`${baseUrl}/doc`, {
            html:newDoc.html,
            name: newDoc.name,
            id: newDoc._id,
          }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': currentUser.accessToken
            }
          }).then((result) => {
            setErrorMessage(null);
            alert("updated successfully");
            navigate('/docs');
          }).catch((err) => {
            setErrorMessage(err.response.data.message);
          });
      } catch(err){
          console.log(err, "HANDLE_UPDATE_ERROR");
          setErrorMessage("HANDLE_UPDATE_ERROR");
      }
    }

    useEffect(() => {
      if (!currentUser || currentUser === {}) {
        navigate("/login");
      }

      if (newDoc._id !== "") {
          socket.emit("create", newDoc._id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(newDoc._id !== ""){
            // setInputText(newDoc.html, false);
            socket.on("update", (data) => {
              setInputText(data.html);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const logout = () => {
      localStorage.removeItem("user");
      navigate('/login');
    }
    
    return (
      <>
        {errorMessage ? (
          <Row className="text-center">
            <Col>
              <h3>{errorMessage}</h3>
              <Button variant="dark" onClick={logout}>Logout</Button>
            </Col>
          </Row>
        ) : (
        <div>
          <Container className="text-center" >
            <Row className="p-4">
              <Col>
              <h4>{newDoc.name.toUpperCase()}</h4>
              </Col>
            </Row>
            <Row className="pb-4">
              <TrixEditor
                  id="trixEditor"
                  placeholder="Editor's placeholder"
                  onChange={handleChange}
                  name="html"
                  value={newDoc.html}
              />
            </Row>
            <Row className="p-4">
              <div style={{textAlign:"center"}}>
                <Button className="m-4" variant="dark"  style={{padding:"5px 40px"}} onClick={handleUpdate} >
                    Update
                </Button>
                <Button variant="dark"  style={{padding:"5px 40px"}} onClick={() => navigate('/docs')} >
                    Doc List
                </Button>
              </div>
            </Row>
          </Container>
        </div>)
        }
      </>
    );
}

export default UpdateDoc;
