import React, { useState } from "react";
import Link from "next/link";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function LoginPage({ session }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [login, setLogin] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const response = await fetch("api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...login,
                email: login.username
            })
        });
        if (!response.ok) {
            const { message } = await response.json();
            message ?
                setError(message) :
                setError("Something unexpected went wrong!");
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        console.log(data);
        session = data.session;
        setIsLoading(false);
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setLogin({
            ...login,
            [name]: value,
        });
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group
                    className="mb-3"
                >
                    <Form.Label>Email address or Username</Form.Label>
                    <Form.Control
                        name="username"
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter email or username" />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    onChange={handleChange}
                    name="password"
                >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mb-3">
                    Login
                </Button>
                {
                    error &&
                    <Alert variant="danger">
                        {error}
                    </Alert>
                }
                {
                    isLoading &&
                    <Alert variant="info">
                        Loading...
                    </Alert>
                }
            </Form>
            Don`t have an account yet?
            Create one <Link href="/register">here</Link>
        </Container>
    );
}