import Loading from "@components/Loading";
import { useRedirectToLogin } from "@lib/hooks/useSession";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Alert, Container, Form, Button, Row, Col } from "react-bootstrap";

const getCodeFromFile = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const validateSubmission = (sub) => {
    let error = "";
    let isRight = true;
    if (sub.code.trim() === "") {
        error = "Code cannot be empty";
        isRight = false;
    }
    return [isRight, error];
};

export default function SubmitPage({ session, data }) {
    const router = useRouter();
    const [hasFile, setHasFile] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [currTask, setCurrTask] = useState(1);
    const { task } = router.query;

    useRedirectToLogin(session);

    useEffect(() => {
        setSubmission({ code: "", task_id: "1" });
    }, []);

    useEffect(() => {
        const sortMethod = (task1, task2) => {
            if (task1.id === currTask) return -1;
            if (task2.id === currTask) return 1;
            if (task1.name.replace(/\s+/g, "") === task) return -1;
            if (task2.name.replace(/\s+/g, "") === task) return 1;
            return task1.name - task2.name;
        };
        if (!data || !data.tasks) return;
        setTasks(data.tasks.sort(sortMethod));
    }, [data, data.tasks, task, currTask, tasks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const [isRight, error] = validateSubmission(submission);
        if (!isRight) {
            setError(error);
            setIsLoading(false);
            return;
        }
        const response = await fetch("/api/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
        });
        if (!response.ok) {
            setError(await response.json().message || 
                "Something unexpected went wrong!");
            setIsLoading(false);
            return;
        }
        const subm = await response.json();
        setIsLoading(false);
        router.push(`/detail/${subm.id}`);
    };

    
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === "task_id") setCurrTask(value);
        setSubmission({
            ...submission,
            [name]: value
        });
    };
    const handleFileChange = async (e) => {
        const [file] = e.target.files;
        let code = "";
        if (!file) {
            setSubmission({
                ...submission,
                code
            });
        }
        code = await getCodeFromFile(file);
        const name = e.target.name;
        if (name === "code") {
            setCurrTask(tasks.find(t => {
                return e.target.files[0]
                    .name.toLowerCase()
                    .includes(t.name.toLowerCase());
            })?.id);
        }
        setSubmission({
            ...submission,
            [name]: code
        });
    };

    if (!data.tasks) {
        return <Loading/>;
    }

    const centerLabel = {
        height: "100%",
        display: "flex",
        alignItems: "center"
    };
    return (
        <Container>
            <h1 className="mb-2">Submit</h1>
            <Form onSubmit={handleSubmit}>
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
                                    (e) => {
                                        handleFileChange(e);
                                        return setHasFile(!!e.target.value);
                                    }                                
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
                            <Form.Select name="task_id" onChange={handleChange}>
                                {
                                    tasks.map(task => {
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
                <Button variant="primary" type="submit" style={{width:"100%"}}>
                    Submit
                </Button>
                {
                    !hasFile && 
                        <Form.Group className="my-3">
                            <Form.Label>Source code</Form.Label>
                            <Form.Control
                                name="code"
                                as="textarea"
                                onChange={handleChange}
                                rows={3} />
                        </Form.Group>
                }
            </Form>
            {
                error &&
                <Alert variant="danger">{error}</Alert>
            }
            {
                isLoading &&
                <Loading/>
            }
        </Container>
    );
}
