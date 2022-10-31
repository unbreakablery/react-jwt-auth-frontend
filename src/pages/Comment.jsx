import React from "react";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Row } from "react-bootstrap";
import useCurrentUser from "../hooks/useCurrentUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useComments from "../hooks/useComments";

const Comment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [did, setDid] = useState(location.state ? location.state.doc._id : '');
  const [dname, setDname] = useState(location.state ? location.state.doc.name : '');
  const [dhtml, setDhtml] = useState(location.state ? location.state.doc.html : '');
  const [dauthor, setDauthor] = useState(location.state ? location.state.doc.author : '');

  const currentUser = useCurrentUser();
  const { getComments, saveComment, deleteComment } = useComments(currentUser?.accessToken);

  const [comments, setComments] = useState([]);
  const [mode, setMode] = useState('view');
  const [myComment, setMyComment] = useState('');

  const loadComments = async (did) => {
    const {data, isError, error} = await getComments(did);
    if (!isError) {
      setComments(data);
    } else {
      toast.error(error.response.data.message, {
        position: "top-right",
        theme: "dark"
      });
      setComments([]);
    }
  }

  const handleMode = () => {
    setMyComment('');
    setMode(mode === 'view' ? 'edit' : 'view');
  }

  const handleChange = (e) => {
    setMyComment(e.target.value);
  }

  const addComment = async () => {
    if (mode !== 'edit') {
      toast.error('You can add your comment in only edit mode!', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    if (!did || !currentUser.email || !myComment) {
      toast.error('Need doc id, author and comment!', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    const {data, isError, error} = await saveComment(did, myComment, currentUser.email);
    if (isError) {
      toast.error(error.response.data.message, {
        position: "top-right",
        theme: "dark"
      });
    } else {
      toast.success(data.message, {
        position: "top-right",
        theme: "dark"
      });
      setMode('view');
      setMyComment('');
      loadComments(did);
    }
  }

  const removeComment = async (id) => {
    if (!id) {
      toast.error('Need comment id!', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    const {data, isError, error} = await deleteComment(id);
    if (isError) {
      toast.error(error.response.data.message, {
        position: "top-right",
        theme: "dark"
      });
    } else {
      toast.success(data.message, {
        position: "top-right",
        theme: "dark"
      });
      setMode('view');
      setMyComment('');
      loadComments(did);
    }
  }

  useEffect(() => {
    if (!currentUser || currentUser === {}) {
      navigate("/signin");
    }

    loadComments(did);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="p-4">
      <ToastContainer />
      <Row className="text-center">
        <Col>
          <h1 className="text-primary mb-4">Comments For Document</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <h1>{dname}</h1>
        <div className="">
          {parse(dhtml)}
        </div>
      </Row>
      <Row>
        <h3 className="text-primary">Comments: ({comments.length})</h3>
        {(!comments || comments.length === 0) &&
          <p className="text-danger">No comments.</p>
        }
        {comments && comments.map((c, index) => (
          <Col md={12} key={index} className="mb-2">
            <h5 className="text-success">{c.author}</h5>
            <p>{parse(c.comment.replace(/(?:\r\n|\r|\n)/g, '<br>'))}</p>
            {c.author === currentUser.email &&
              <Button className="m-2 btn-sm" variant="dark" onClick={() => removeComment(c._id)}>Remove</Button>
            }
          </Col>))
        }
      </Row>
      { mode === 'edit' &&
      <Row className="mt-4">
        <Col md={12}>
          <div className="d-flex flex-column mb-3">
            <label>My comment:</label>
            <textarea value={myComment} onChange={handleChange} />
            <Row>
              <Col md={12}>
                <Button className="m-2" variant="dark" onClick={addComment}>Save</Button>
                <Button className="m-2" variant="secondary" onClick={handleMode}>Cancel</Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      }
      <Row className="p-4">
        <div className="text-center">
          <Button className="m-2" variant="success" onClick={handleMode}>Add my comment</Button>
          <Button className="m-2" variant="dark" onClick={() => navigate('/docs')}>All Documents</Button>
        </div>
      </Row>
    </Container>
  )
}

export default Comment;