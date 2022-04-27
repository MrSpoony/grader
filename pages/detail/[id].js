import Overview from "@components/Overview";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Alert, Tab, Tabs, Container } from "react-bootstrap";

export default function TaskDetailPage({ data }) {
    const router = useRouter();
    const { id } = router.query;
    const [submission, setSubmission] = useState({});

    useEffect(() => {
        if (!id) return;
        const loadSubmission = async () => {
            const response = await fetch(`/api/submission/${id}`);
            if (!response.ok) {
                let message = "";
                try {
                    message = await response.json().message;
                } catch (e) {
                    throw new Error(response.status);
                }
                throw new Error(message);
            }
            const submission = await response.json();
            setSubmission(submission);
        };
        loadSubmission();
    }, [id]);

    if (!submission || !data.tasks || !data.statuses) return (
        <Container>
            <Alert variant="info">
                Loading
            </Alert>
        </Container>
    );

    return (
        <Container>
            <h1>
                Submission Detail
            </h1>
            <Tabs
                defaultActiveKey="overview"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="overview" title="Overview">
                    <Overview
                        submission={submission}
                        statuses={data?.statuses}
                        tasks={data?.tasks}
                    />
                </Tab>
                <Tab eventKey="source" title="Source">
                    Something else
                </Tab>
                <Tab eventKey="compilation" title="Compilation">
                    Something else else
                </Tab>
                <Tab eventKey="grading" title="Grading">
                    Something else else
                </Tab>
            </Tabs>
        </Container>
    );
}
