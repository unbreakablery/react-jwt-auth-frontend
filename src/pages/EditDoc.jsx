import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Row } from "react-bootstrap";
import { TrixEditor } from "react-trix";
import { io } from "socket.io-client";
import useCurrentUser from "../hooks/useCurrentUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { downloadPDF, downloadPDFByCode, runCode } from "../utils";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';

const EditDoc = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const socket = io.connect(baseUrl);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [saving, setSaving] = useState(false);
  const [did, setDid] = useState(location.state ? location.state.doc._id : '');
  const [dname, setDname] = useState(location.state ? location.state.doc.name : '');
  const [dcontent, setDcontent] = useState(location.state ? location.state.doc.html : '');
  const [dauthor, setDauthor] = useState(location.state ? location.state.doc.author : '');
  const [dtype, setDtype] = useState(location.state ? location.state.doc.type : '');
  const [runCodeResult, setRunCodeResult] = useState('');
  const [isRunCode, setIsRunCode] = useState(false);

  function setInputText(text) {
    let element = document.querySelector("trix-editor");
    element.value = "";
    element.editor.setSelectedRange([0, 0]);
    element.editor.insertHTML(text);
  }

  const handleMirrorChange = (value, viewUpdate) => {
    setDcontent(value);
  }

  const handleDnameChange = (e) => {
    setDname(e.target.value);
  }

  const handleChange = (html, text) => {
    setDcontent(html);
  }

  const handleDtypeChange = (e) => {
    setDtype(e.target.value);
    setRunCodeResult('');
  }

  const handleRunCode = async () => {
    setRunCodeResult('');

    if (!dcontent) {
      toast.error("Can't run code! Code content is empty.", {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    setIsRunCode(true);
    const {data: result, isError, error} = await runCode(dcontent);
    if (isError) {
      toast.error(error.response.data.message, {
        position: "top-right",
        theme: "dark"
      });
      return;
    }
    toast.success("Your code ran successfully!", {
      position: "top-right",
      theme: "dark"
    });
    setRunCodeResult(result);
    setIsRunCode(false);
  }

  const updateDocument = async () => {
    if (saving) return;
    if (!dname) {
      toast.error('Please enter your document name!', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${baseUrl}/doc`, {
        html: dcontent,
        name: dname,
        id: did,
        author: dauthor,
        type: dtype
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.accessToken
        }
      }).then((result) => {
        toast.success("Updated successfully!", {
          position: "top-right",
          theme: "dark"
        });
      }).catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-right",
          theme: "dark"
        });
      });
    } catch (err) {
      console.log(err, "HANDLE_UPDATE_ERROR");
      toast.error("HANDLE_UPDATE_ERROR", {
        position: "top-right",
        theme: "dark"
      });
    } finally {
      setSaving(false);
    }
  }

  const handleDownloadPDF = async () => {
    //in case 'code' type
    if (dtype === 'code') {
      if (!await downloadPDFByCode(dname, dcontent)) {
        toast.error("Can't download as PDF! Document name or content is empty.", {
          position: "top-right",
          theme: "dark"
        });
        return;
      }
      toast.success("Downloaded your document as PDF successfully!", {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    //in case 'non-code' type
    if (!await downloadPDF()) {
      toast.error("Can't download as PDF! Document content is empty.", {
        position: "top-right",
        theme: "dark"
      });
      return;
    }
    toast.success("Downloaded your document as PDF successfully!", {
      position: "top-right",
      theme: "dark"
    });
  }

  useEffect(() => {
    if (!currentUser || currentUser === {}) {
      navigate("/signin");
    }

    // if (did !== "") {
    //   socket.emit("create", did);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (did !== "") {
      // socket.on("update", (data) => {
      //   setInputText(data.html);
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const signout = () => {
    localStorage.removeItem("user");
    navigate('/signin');
  }

  return (
    <>
      <Container className="p-4">
        <ToastContainer />
        <Row className="text-center">
          <Col>
            <h1 className="text-primary mb-4">Edit Document</h1>
          </Col>
        </Row>
        <Row className="p-4">
          <Col md={12}>
            <div className="d-flex flex-column mb-3">
              <label>Document Name:</label>
              <input id="dname" type="text" value={dname} onChange={handleDnameChange} />
            </div>
          </Col>
          <Col md={12}>
            <div className="d-flex flex-column mb-3">
              <label>Document Type:</label>
              <select value={dtype} onChange={handleDtypeChange}>
                <option value="non-code">Non Code</option>
                <option value="code">Code</option>
              </select>
            </div>
          </Col>
          <Col md={12}>
            <label>Document Content:</label>
            {dtype === 'non-code' ? (
              <TrixEditor
                id="trixEditor"
                placeholder="Editor's placeholder"
                onChange={handleChange}
                name="html"
                value={dcontent}
              />) : (
              <>
                <CodeMirror
                  value={dcontent}
                  height="200px"
                  extensions={[javascript({ jsx: true })]}
                  onChange={handleMirrorChange}
                  theme="dark"
                />
                <Col md={12}>
                  <Button className="m-2" variant="primary" onClick={handleRunCode}>
                    {isRunCode ? 'Running your code...' : 'Run'}
                  </Button>
                </Col>
                <Col md={12}>
                  <label className="text-success">Result:</label>
                  <p>{runCodeResult}</p>
                </Col>
              </>
            )}
          </Col>
        </Row>
        <Row className="p-4">
          <div className="text-center">
            <Button className="m-2" variant="success" onClick={updateDocument} >
              {saving ? "Saving please wait..." : "Update Document"}
            </Button>
            <Button className="m-2" variant="primary" onClick={handleDownloadPDF} >Download as PDF</Button>
            <Button className="m-2" variant="dark" onClick={() => navigate('/docs')}>All Documents</Button>
            <Button className="m-2" variant="secondary" onClick={signout}>Sign Out</Button>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default EditDoc;
