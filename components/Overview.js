import React, { useEffect, useState } from "react";
import { Table, Badge, } from "react-bootstrap";

export default function Overview({ submission, statuses, tasks }) {
    const [compilation, setCompilation] = useState("");
    const [sample, setSample] = useState("");
    const [verdict, setVerdict] = useState("");

    useEffect(() => {
        if (!statuses || !submission?.compilation_status) return;
        setCompilation(statuses.find(s => {
            return s.id === submission.compilation_status;
        })?.status);
    }, [submission?.compilation_status, statuses]);

    useEffect(() => {
        if (!statuses || !submission.testcase_statuses) return;
        const testcaseStatus = submission.testcase_statuses?.find(status => {
            return status.testcase.testgroup.testgrouptype["type"] === "sample";
        });
        setSample(statuses.find(s => {
            return s.id === testcaseStatus.status_id;
        })?.status);
    }, [submission?.testcase_statuses, statuses]);

    useEffect(() => {
        if (!statuses || !submission.verdict) return;
        setVerdict(statuses.find(s => {
            return s.id === submission.verdict;
        })?.status);
    }, [statuses, submission?.verdict]);


    if (!submission || !statuses) return (<>Loading</>);

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
                                <Badge bg={
                                    compilation === "Success" ? "success" : 
                                        compilation === "Warning" ? "warning" : "danger"}>
                                    {compilation}
                                </Badge>
                            </td>
                        </tr>
                        <tr>
                            <th>Sample Cases</th>
                            <td>
                                <Badge bg={
                                    sample === "Success" ? "success" : 
                                        sample === "Warning" ? "warning" : "danger"}>
                                    {sample}
                                </Badge>
                            </td>
                        </tr>
                        <tr>
                            <th>Verdict</th>
                            <td>
                                <Badge bg={
                                    verdict === "Success" ? "success" : 
                                        verdict === "Warning" ? "warning" : "danger"}>
                                    {verdict}
                                </Badge>
                            </td>
                        </tr>
                    </>)

                }</tbody>
            </Table>
        </>
    );
}