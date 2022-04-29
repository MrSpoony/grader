import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button, Container, Alert } from "react-bootstrap";
import Loading from "@components/Loading";
import { getSampleCases } from "@lib/api";
import SampleCases from "@components/SampleCases";
import Testgroups from "@components/Testgroups";

export default function TaskDetailPage({ data }) {
    const router = useRouter();
    const [task, setTask] = useState({});
    const [sampleCases, setSampleCases] = useState([]);
    const [error, setError] = useState("");

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
            return data?.testgrouptypes.find(tgt => {
                return tgt.id === tg.testgrouptype_id;
            })?.type === "sample";
        });
        const loadSampleCases = async (sampleTestgroup) => {
            let data;
            try {
                data = await getSampleCases(sampleTestgroup.id);
            } catch (e) {
                setError(e.message);
                return;
            }
            setSampleCases(data.testcases);
        };
        loadSampleCases(sampleTestgroup);
    }, [data, task]);

    if (!data.tasks || !task?.statement || !task?.name) return <Loading/>;

    return (
        <Container>
            <h1>
                {task.name}
            </h1>
            <p style={{ whiteSpace: "pre-wrap" }}>
                {task.statement}
            </p>
            {
                task.testgroups && <Testgroups
                    testgroups={task.testgroups}
                    testgrouptypes={data?.testgrouptypes}
                />
            }
            {
                sampleCases.length && <SampleCases sampleCases={sampleCases}/>
            }
            <Link href={`/submit?task=${task.name.replace(/\s+/g, "")}`} passHref>
                <Button variant="primary">
                    Submit
                </Button>
            </Link>
            { error &&
            <Alert variant="danger">
                {error}
            </Alert>}
        </Container>
    );
}
