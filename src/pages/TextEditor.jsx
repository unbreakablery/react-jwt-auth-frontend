import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import { TrixEditor } from "react-trix";
import "trix/dist/trix";
import "trix/dist/trix.css";
import Options from "../components/Options";
import useCurrentUser from "../hooks/useCurrentUser";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const initialValue = { html: "", name: "" };

export default function TextEditor() {
  const [value, setValue] = useState(initialValue);
  const [docs, setDocs] = useState([]);
  const [change, setChange] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(false);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  
  const getDocs = async () => {
    setLoading(true);
    try {
      await axios.get(`${BASE_URL}/doc`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.accessToken
        }
      }).then((result) => {
        setDocs(result.data);
        setErrorMessage(null);
      }).catch((err) => {
        setErrorMessage(err.response.data.message);
      });
    } catch (err) {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };
  const postDocument = async () => {
    const { html, name } = value;
    if (loading) return;
    if (!name) return alert("Please enter some text");
    setLoading(true);
    try {
      if (!selectedDocument) {
        await axios.post(`${BASE_URL}/doc`, {
          html,
          name,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': currentUser.accessToken
          }
        }).then((result) => {
          setErrorMessage(null);
          alert("post successfully");
          setDocs(result.data);
        }).catch((err) => {
          setErrorMessage(err.response.data.message);
        });
        
      } else {
        await axios.put(`${BASE_URL}/doc`, {
            html,
            name,
            id: selectedDocument._id,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': currentUser.accessToken
            }
        }).then((result) => {
          setErrorMessage(null);
          alert("updated successfully");
          setDocs(result.data);
          setSelectedDocument(false);
        }).catch((err) => {
          setErrorMessage(err.response.data.message);
        });
      }
      setChange((prev) => !prev);
      setValue(initialValue);
    } catch (err) {
      setDocs([]);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (html, text) => {
    setValue({ html, name: text });
  };

  const handleOptionsChange = (e) => {
    if (e.target.value === "none") return setSelectedDocument(false);
    const document = docs.find((doc) => doc._id === e.target.value);
    setValue({ html: document.html, name: document.name });
    setSelectedDocument(document);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  }

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    getDocs();
  }, [change]);

  return (
    <>
      <Container style={{ padding: "40px 0" }}>
        {errorMessage ? (
        <Row className="text-center">
          <Col>
            <h3 className="text-danger">{errorMessage}</h3>
            <Button variant="dark" onClick={logout}>Logout</Button>
          </Col>
        </Row>
        ) : (
          <>
            <TrixEditor
              id="trixEditor"
              placeholder="Editor's placeholder"
              onChange={handleChange}
            />
            <div style={{ padding: "40px" }}>
              <Options handleOptionsChange={handleOptionsChange} docs={docs} />

            </div >
            <div style={{ textAlign: "center", margin: "40px" }}>
              <Button className="m-4" variant="dark" onClick={postDocument}>
                {loading
                  ? "Loading please wait..."
                  : selectedDocument
                    ? "Update"
                    : "Post"}
              </Button>
              <Button variant="dark" onClick={() => navigate('/docs')}>Doc List</Button>
            </div>
          </>
          )
        }
      </Container>
    </>
  );
}
