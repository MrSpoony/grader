import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Loading from "./Loading";
import Status from "./Status";

export default function Overview({ submission, statuses, tasks }) {
    const [sample, setSample] = useState("");

    useEffect(() => setSample("Pending"), []);

    useEffect(() => {
        if (!statuses || !submission.testcase_statuses) return;
        const testcaseStatus = submission.testcase_statuses?.find(status => {
            return status.testcase.testgroup.testgrouptype["type"] === "sample";
        });
        setSample(statuses.find(s => {
            return s.id === testcaseStatus.status_id;
        })?.status);
    }, [submission?.testcase_statuses, statuses]);

    if (!submission || !statuses) return <Loading/>;

    return (
        <>
            <h3>Overview</h3>
            <Table>
                <tbody>{
                    submission && (<>
                        <tr>
                            <th>ID</th>
                            <td>{submission.id}</td>
                        </tr>
                        <tr>
                            <th>Time</th>
                            <td>{new Date(submission.time).toLocaleString() ? 
                                new Date(submission.time).toLocaleString() :
                                ""
                            }</td>
                        </tr>
                        <tr>
                            <th>Task</th>
                            <td>{
                                tasks &&
                                    tasks.find(t => {
                                        return (
                                            t.id === submission.task_id
                                        );
                                    })?.name
                            }</td>
                        </tr>
                        <tr>
                            <th>Compilation</th>
                            <td>
                                <Status
                                    variant={submission.compilation_status}
                                    statuses={statuses}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Sample Cases</th>
                            <td>
                                <Status variant={sample}/>
                            </td>
                        </tr>
                        <tr>
                            <th>Verdict</th>
                            <td>
                                <Status 
                                    variant={submission.verdict}
                                    statuses={statuses}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Score</th>
                            <td>{submission?.score && submission.score}</td>
                        </tr>
                    </>)
                }</tbody>
            </Table>
        </>
    );
}
