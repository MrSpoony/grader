import { useRedirectToLogin } from "@lib/hooks/useSession";
import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import Link from "next/link";
import Status from "@components/Status";

export default function SubmissionsPage({ data, session }) {
    const [submissions, setSubmissions] = useState([]);
    useRedirectToLogin(session);

    useEffect(() => {
        const loadSubmissions = async () => {
            const response = await fetch("/api/submission");
            if (!response.ok) {
                let message = "";
                try {
                    message = await response.json().message;
                } catch (e) {
                    throw new Error(response.status);
                }
                throw new Error(response.status, message);
            }
            let data = await response.json();
            data = data.sort((b, a) => {
                a = new Date(a.time);
                b = new Date(b.time);
                return a.getTime() - b.getTime();
            });
            setSubmissions(data);
        };
        loadSubmissions();
    }, []);

    if (!submissions ||
        !data.tasks ||
        !data.statuses
    ) return (<>Loading...</>);

    return (
        <Container>
            <h1>Submissions</h1>
            <Table>
                <thead>
                    <th>Time</th>
                    <th>Task</th>
                    <th>Score</th>
                    <th>Compiler</th>
                    <th>Verdict</th>
                    <th>Detail</th>
                </thead>
                <tbody>{
                    submissions.map(s => {
                        const task = data.tasks.find(t => t.id === s.task_id);
                        return (<tr key={s.id}>
                            <td>{new Date(s.time).toLocaleString()}</td>
                            <td><Link href={`/tasks/${
                                task?.name.replace(/\s/g, "")
                            }`}><a>{task?.name.replace(/\s/g, "")}</a></Link></td>
                            <td>{s.score}</td>
                            <td><Status
                                variant={s.compilation_status}
                                statuses={data?.statuses}
                            /></td>
                            <td><Status
                                variant={s.verdict}
                                statuses={data?.statuses}
                            /></td>
                            <td><Link
                                href={`/detail/${s.id}`}
                            ><a>Detail</a></Link></td>
                        </tr>);
                    })
                }</tbody>
            </Table>
        </Container>
    );
}
