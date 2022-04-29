import React from "react";
import Link from "next/link";
import { Alert, Card, Container } from "react-bootstrap";
import Loading from "@components/Loading";

export default function IndexPage({ data }) {
    if (!data.tasks) return <Loading/>;
    return (
        <Container>
            <h1 className="mb-5">Tasks:</h1>
            {
                data.tasks.map(task => {
                    return (
                        <Card key={task.id} className="mb-3">
                            <Card.Header className="p-0">
                                <h5 className="mb-0 p-2">
                                    <Link 
                                        href={`tasks/${
                                            task.name.replace(/\s/g, "")
                                        }`}
                                    >
                                        <a className="text-dark">
                                            {task.name}
                                        </a>
                                    </Link>
                                </h5>
                            </Card.Header>
                        </Card>
                    );
                })
            }
        </Container>
    );
}
