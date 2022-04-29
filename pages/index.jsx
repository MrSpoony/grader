import React from "react";
import Link from "next/link";
import { Alert, Card, Container } from "react-bootstrap";
import Loading from "@components/Loading";
import Task from "@components/Task";

export default function IndexPage({ data }) {
    if (!data.tasks) return <Loading/>;
    return (
        <Container>
            <h1 className="mb-5">Tasks:</h1>
            {
                data.tasks.map(task => {
                    return <Task key={task.id} task={task}/>;
                })
            }
        </Container>
    );
}
