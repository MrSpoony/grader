import Compilation from "@components/Compilation";
import Overview from "@components/Overview";
import Source from "@components/Source";
import Grading from "@components/Grading";
import { useRedirectToLogin } from "@lib/hooks/useSession";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Alert, Tab, Tabs, Container } from "react-bootstrap";
import Loading from "@components/Loading";
import { getSubmissionDetail } from "@lib/api";

export default function TaskDetailPage({ data, session }) {
    const router = useRouter();
    const { id } = router.query;
    const [submission, setSubmission] = useState({});
    const [error, setError] = useState("");

    useRedirectToLogin(session);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!id) return;
            const loadSubmission = async () => {
                let submission;
                try {
                    submission = await getSubmissionDetail(id);
                } catch (e) {
                    setError(e.message);
                    return;
                }
                setSubmission(submission);
            };
            loadSubmission();
            if (data?.statuses.find(s => {
                return s.id === submission.verdict;
            })?.status.toLowerCase() !== "pending") 
                clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [id, data?.statuses, submission.verdict]);

    if (!submission || !data.tasks || !data.statuses) return <Loading/>;

    return (
        <Container>
            <h1>Submission Detail</h1>
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
                    <Source
                        submission={submission}
                    />
                </Tab>
                <Tab eventKey="compilation" title="Compilation">
                    <Compilation
                        submission={submission}
                    />
                </Tab>
                <Tab eventKey="grading" title="Grading">
                    <Grading
                        submission={submission}
                        testgrouptypes={data?.testgrouptypes}
                        statuses={data?.statuses}
                        tasks={data?.tasks}
                    />
                </Tab>
            </Tabs>
            { error &&
                <Alert variantt="dandger">
                    {error}
                </Alert>
            }
        </Container>
    );
}
