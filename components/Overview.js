import React, { useEffect, useState } from "react";
import { Table, Badge, } from "react-bootstrap";

export default function Overview({ submission, statuses, tasks }) {
    const [compilation, setCompilation] = useState("");
    const [sample, setSample] = useState("");

    useEffect(() => {
        if (!statuses || !submission?.compilation_status) return;
        setCompilation(statuses.find(s => {
            return (
                s.id === 
            submission.compilation_status
            );
        })?.status);
    }, [statuses, submission?.compilation_status]);

    useEffect(() => {
        // const loadSamples = () => {
        //     submission.testcase_statuses.find(status => {
        //         if (status.testcase.testgroup_id);
        //     });
        // };
        // loadSamples();
    }, [submission?.testcase_statuses]);


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
                            <td>
                                <pre>{JSON.stringify(submission, 2, 2)}</pre>
                            </td>
                        </tr>
                    </>)

                }</tbody>
            </Table>
        </>
    );
}
