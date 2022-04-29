import React from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";
import Loading from "./Loading";

export default function Task({ task }) {
    if (!task) return <Loading/>;
    return (
        <Card className="mb-3">
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
}
