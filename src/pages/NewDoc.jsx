import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import { TrixEditor } from "react-trix";
import "trix/dist/trix";
import "trix/dist/trix.css";
import useCurrentUser from "../hooks/useCurrentUser";
import { downloadPDF, downloadPDFByCode, runCode } from "../utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const NewDoc = () => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [dname, setDname] = useState('');
  const [dcontent, setDcontent] = useState('');
  const [dtype, setDtype] = useState('non-code');
  const [saving, setSaving] = useState(false);
  const [runCodeResult, setRunCodeResult] = useState('');
  const [isRunCode, setIsRunCode] = useState(false);

  const saveDocument = async () => {
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
      await axios.post(`${BASE_URL}/doc`, {
        type: dtype,
        name: dname,
        html: dcontent,
        author: currentUser.email
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.accessToken
        }
      }).then((result) => {
        toast.success('Saved your document successfully!', {
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
      toast.error(err.response.data.message, {
        position: "top-right",
        theme: "dark"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (html, text) => {
    setDcontent(html);
  };

  const handleMirrorChange = (value, viewUpdate) => {
    setDcontent(value);
  }

  const handleDnameChange = (e) => {
    setDname(e.target.value);
  }

  const handleDtypeChange = (e) => {
    setDtype(e.target.value);
    setRunCodeResult('');
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

  const signout = () => {
    localStorage.removeItem("user");
    navigate('/signin');
  }

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, []);

  useEffect(() => {
    if (dtype === 'code') {
      setDcontent("console.log('hello world!');");
      setRunCodeResult('');
      setIsRunCode(false);
    }
  }, [dtype]);

  return (
    <>
      <Container className="p-4">
        <ToastContainer />
        
        <Row className="text-center">
          <Col>
            <h1 className="text-primary mb-4">New Document</h1>
          </Col>
        </Row>
        <Row>
          <div className="d-flex flex-column mb-3">
            <label>Document Name:</label>
            <input id="dname" type="text" value={dname} onChange={handleDnameChange} />
          </div>
          <div className="d-flex flex-column mb-3">
            <label>Document Type:</label>
            <select value={dtype} onChange={handleDtypeChange}>
              <option value="non-code">Non Code</option>
              <option value="code">Code</option>
            </select>
          </div>
          <label>Document Content:</label>
          {dtype === 'non-code' ? (
          <TrixEditor
            id="trixEditor"
            placeholder="Editor's placeholder"
            onChange={handleChange}
          />) : (
            <>
              <CodeMirror
                value="console.log('hello world!');"
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
          <div style={{ textAlign: "center", margin: "40px" }}>
            <Button className="m-2" variant="success" onClick={saveDocument}>
              {saving ? "Saving please wait..." : "Save Document"}
            </Button>
            <Button className="m-2" variant="primary" onClick={handleDownloadPDF}>Download as PDF</Button>
            <Button className="m-2" variant="dark" onClick={() => navigate('/docs')}>All Documents</Button>
            <Button className="m-2" variant="secondary" onClick={signout}>Sign Out</Button>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default NewDoc;