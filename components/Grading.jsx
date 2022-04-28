import React, { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import Link from "next/link";

export default function Source({ submission, testgrouptypes, statuses }) {
    const [testcaseStatuses, setTestcaseStatuses] = useState([]);
    const [samples, setSamples] = useState([]);
    const [reals, setReals] = useState([]);

    useEffect(() => {
        if (!testcaseStatuses) return;
        setSamples(testcaseStatuses.filter(ts => {
            return ts.testcase.testgroup.testgrouptype.type === "sample";
        }));
        setReals(testcaseStatuses.filter(ts => {
            return ts.testcase.testgroup.testgrouptype.type !== "sample";
        }));
    }, [testcaseStatuses]);

    useEffect(() => {
        if (!submission?.testcase_statuses ||
            !testgrouptypes ||
            !statuses) return;
        setTestcaseStatuses(submission.testcase_statuses.sort((a, b) => {
            if (testgrouptypes.find(tgt => {
                return tgt.id === a.testcase.testgroup;
            })?.type.toLowerCase() === "sample") return -1;
            const diffTestgroups = a.testcase.testgroup.id - 
                    b.testcase.testgroup.id;
            if (diffTestgroups) return diffTestgroups;
            return a.testcase.id - b.testcase.id;
        }).map(el => {
            el.status = statuses.find(s => {
                return s.id === el.status_id;
            })?.status;
            return el;
        }));
    }, [submission?.testcase_statuses, testgrouptypes, statuses]);

    if (!testcaseStatuses.length ||
        !submission ||
        !testgrouptypes ||
        !statuses ||
        !samples ||
        !reals
    ) return (<>Loading</>);

    return (
        <>
            <h3>Grading</h3>
            <Table>{ submission && <>
                <thead>
                    <tr>
                        <th>Case</th>
                        <th>Verdict</th>
                        <th>Diff</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        samples?.map((ts, i) => {
                            return (<tr key={ts.id}>
                                <td>Sample.{String(i).padStart(2, "0")}</td>
                                <td>
                                    <Badge bg={
                                        ts.status === "Success" ? "success" :
                                            ["Warning", "Pending"].includes(ts.status) ? "warning" : "danger"}>
                                        {ts.status}
                                    </Badge>
                                </td>
                                <td><Link href="#">Diff</Link></td>
                            </tr>);
                        })
                    }
                    {

                        reals?.map(ts => {
                            return (<tr key={ts.id}>
                                <td>{`${String(ts.testcase.testgroup_id).padStart(2, "0")}.${String(ts.testcase.id).padStart(2, "0")}`}</td>
                                <td>
                                    <Badge bg={
                                        ts.status === "Success" ? "success" :
                                            ["Warning", "Pending"].includes(ts.status) ? "warning" : "danger"}>
                                        {ts.status}
                                    </Badge>
                                </td>
                                <td></td>
                            </tr>);
                        })
                    }
                </tbody>
            </>}</Table>
            <pre>{JSON.stringify(testcaseStatuses, 2, 4)}</pre>
        </>
    );
}
