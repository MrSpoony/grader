import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Alert, Button, Container, Row, Col } from "react-bootstrap";

export default function TaskDetailPage({ data }) {
    const router = useRouter();
    const [task, setTask] = useState({});
    const [sampleCases, setSampleCases] = useState([]);

    const { name } = router.query;

    useEffect(() => {
        if (!data.tasks) return;
        const task = data.tasks.find(task => {
            return task.name.replace(/\s+/g, "") === name;
        });
        setTask(task);
    }, [data, name]);

    useEffect(() => {
        if (!data.testgrouptypes || !task?.testgroups) return;
        const sampleTestgroup = task.testgroups.find(tg => {
            return tg.testgrouptype_id === 1;
        });
        const loadSampleCases = async (sampleTestgroup) => {
            const response = await fetch(`/api/testgroup/${sampleTestgroup.id}`);
            if (!response.ok) throw new Error(await response.json());
            const data = await response.json();
            setSampleCases(data.testcases);
        };
        loadSampleCases(sampleTestgroup);
    }, [data, task]);

    if (!data.tasks || !task?.statement || !task?.name) return (
        <Container>
            <Alert variant="info">
                Loading
            </Alert>
        </Container>
    );

    return (
        <Container>
            <h1>
                {task.name}
            </h1>
            <p style={{ whiteSpace: "pre-wrap" }}>
                {task.statement}
            </p>
            {
                sampleCases &&
                <> 
                    <h4 className="mb-4 mt-4">Samples:</h4>
                    {
                        sampleCases.map((sc, i) => {
                            return (
                                <div key={sc.id} >
                                    <h5>Sample.{String(i).padStart(2, "0")}</h5>
                                    <Row className="mb-4">
                                        <Col className="border">
                                            <h6 className="mt-3">
                                                    Input:
                                            </h6>
                                            <pre>
                                                {sc.input}
                                            </pre>
                                        </Col>
                                        <Col className="border">
                                            <h6 className="mt-3">
                                                    Output:
                                            </h6>
                                            <pre>
                                                {sc.output}
                                            </pre>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })
                    }
                </>
            }
            <Link href={`/submit?task=${task.name.replace(/\s+/g, "")}`} passHref>
                <Button variant="primary">
                    Submit
                </Button>
            </Link>
        </Container>
    );
}
