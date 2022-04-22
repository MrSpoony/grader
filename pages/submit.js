import React, { useState } from "react";
import { Alert, Container, Form, Button, Row, Col } from "react-bootstrap";

export default function SubmitPage({ data }) {
    const [hasFile, setHasFile] = useState(false);

    if (!data.tasks) {
        return (
            <Container>
                <Alert variant="info">Loading...</Alert>
            </Container>
        );
    }

    const centerLabel = {
        height: "100%",
        display: "flex",
        alignItems: "center"
    };
    return (
        <Container>
            <h1 className="mb-2">Submit</h1>
            <Form>
                <Form.Group className="mb-3">
                    <Row>
                        <Col sm={3}>
                            <Form.Label style={centerLabel}>
                                Source file
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <Form.Control
                                type="file"
                                name="code"
                                onChange={
                                    () => setHasFile(!hasFile)
                                }
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" name="task">
                    <Row>
                        <Col sm={3}>
                            <Form.Label style={centerLabel}>
                                Task
                            </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <Form.Select>
                                {
                                    data.tasks.map(task => {
                                        return (
                                            <option
                                                key={task.id}
                                                value={task.id}
                                            >
                                                {task.name}
                                            </option>
                                        );
                                    })
                                }
                            </Form.Select>
                        </Col>
                    </Row>
                </Form.Group>
                <Button variant="primary" style={{width:"100%"}}>
                    Submit
                </Button>
                {
                    !hasFile && 
                        <Form.Group className="my-3">
                            <Form.Label>Source code</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                }
            </Form>
        </Container>
    );
}
