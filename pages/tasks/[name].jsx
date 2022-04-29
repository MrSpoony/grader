import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Loading from "@components/Loading";
import { Alert } from "bootstrap";
import { getSampleCases } from "@lib/api";

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
                task.testgroups ?
                    <>
                        <h4>There are {task.testgroups.length} testgroups:</h4>
                        <h5>Limits:</h5>
                        <ul>
                            {
                                task.testgroups.map((tg, i) => {
                                    if (data?.testgrouptypes.find(tgt => {
                                        return tgt.id === tg.testgrouptype_id;
                                    })?.type === "sample") return "";
                                    return (<li key={tg.key}>
                                    Testgroup {i+1}: {tg.limits}
                                    </li>);
                                })
                            }
                        </ul>
                        <h5>Timelimits:</h5>
                        <ul>
                            {
                                task.testgroups.map((tg, i) => {
                                    if (data?.testgrouptypes.find(tgt => {
                                        return tgt.id === tg.testgrouptype_id;
                                    })?.type === "sample") return "";
                                    return (<li key={tg.key}>
                                    Testgroup {i+1}: {tg.timelimit}ms
                                    </li>);
                                })
                            }
                        </ul>
                    </> :
                    ""
            }
            {
                sampleCases.length ?
                    <> 
                        <h4 className="my-4">Samples:</h4>
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
                    </> : ""
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
