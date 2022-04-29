import { useRedirectToLogin } from "@lib/hooks/useSession";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
import Link from "next/link";
import Status from "@components/Status";
import Loading from "@components/Loading";
import { getSubmissions, getUsers, updateSubmissionScore } from "@lib/api";

export default function SubmissionsPage({ data, session }) {
    const [submissions, setSubmissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [newScore, setNewScore] = useState(0);
    const [error, setError] = useState("");
    useRedirectToLogin(session);

    const deleteSubmission = async (s) => {
        setSubmissions(submissions.filter(sb => sb.id !== s.id));
        setError("");
        try {
            await deleteSubmission(s);
        } catch (e) {
            setError(e.message);
            return;
        }
    };

    const changeScore = async (e, s) => {
        e.preventDefault();
        setError("");
        setSubmissions(submissions.map(sb => {
            if (sb.id !== s.id) return sb;
            let maxPoints = data?.tasks?.find(t => {
                return t.id === s.task_id;
            }).testgroups.map(tg => tg.points);
            maxPoints = maxPoints.reduce((a, b) => a + b);
            sb.score = newScore > maxPoints ? maxPoints : 
                newScore > 0 ? newScore : 0;
            return sb;
        }));
        try {
            await updateSubmissionScore(s, newScore);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setNewScore(val);
    };

    useEffect(() => {
        const loadSubmissions = async () => {
            let data;
            try {
                data = await getSubmissions();
            } catch (e) {
                setError(e.message);
                return;
            }
            data = data.sort((b, a) => {
                a = new Date(a.time);
                b = new Date(b.time);
                return a.getTime() - b.getTime();
            });
            setSubmissions(data);
        };
        loadSubmissions();
    }, []);

    useEffect(() => {
        if (!session?.user?.roles?.find(r => r.role === "admin")) return;
        const loadUsers = async () => {
            let data;
            try {
                data = await getUsers();
            } catch (e) {
                setError(e.message);
                return;
            }
            setUsers(data);
        };
        loadUsers();
    }, [session]);

    if (!submissions ||
        !data.tasks ||
        !data.statuses ||
        !session?.user
    ) return <Loading/>;

    return (
        <Container>
            <h1>Submissions</h1>
            { error &&
            <Alert variant="danger">
                {error ? "Error: " + error : "Some unknown error occured..."}
            </Alert>
            }
            <Table>
                <thead>
                    <tr>
                        <th>Time</th>
                        { session?.user?.roles?.find(r => r.role === "admin") &&
                        <th>User</th>}
                        <th>Task</th>
                        <th>Score</th>
                        <th>Compiler</th>
                        <th>Verdict</th>
                        <th>Detail</th>
                        { session?.user?.roles?.find(r => r.role === "admin") &&
                        <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>{
                    submissions.map(s => {
                        const task = data.tasks.find(t => t.id === s.task_id);
                        return (<tr key={s.id}>
                            <td>{new Date(s.time).toLocaleString()}</td>
                            { session?.user?.roles?.find(r => r.role === "admin") &&
                            <td>{users?.find(u => {
                                return u.id === s.user_id;
                            })?.username}</td>}
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
                            { session?.user?.roles?.find(r => r.role === "admin") &&
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => deleteSubmission(s)}
                                >
                                    Delete
                                </Button>
                                <Form 
                                    style={{ display: "inline"}}
                                    onSubmit={(e) => changeScore(e, s)}
                                >
                                    <Form.Control
                                        className="mx-2"
                                        type="number"
                                        placeholder="New Score"
                                        onChange={handleChange}
                                        style={{
                                            display: "inline-block",
                                            width: "20%"
                                        }} />
                                    <Button className="mx-2" type="submit">
                                        Change score
                                    </Button>
                                </Form>
                            </td>}
                        </tr>);
                    })
                }</tbody>
            </Table>
        </Container>
    );
}
