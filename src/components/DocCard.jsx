import React from "react";
import parse from "html-react-parser";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function DocCard({ doc, index }) {
    const navigate = useNavigate();
    const editDoc = () => {

        navigate("/edit", {
            replace: true,
            state: {
                doc: doc
            },
        });
    };

    return (
        <Row style={{padding: "10px"}}>
            <Col md={4}>
                <h6>{doc.name.toUpperCase()}</h6>
            </Col>
            <Col md={4}>
                {parse(doc.html)}
            </Col>
            <Col md={4} className="text-right">
                <Button variant="dark"  style={{padding:"5px 60px"}} onClick={editDoc}>
                    Edit
                </Button>
            </Col>
        </Row>

    );
}

export default DocCard;
