import React, { useState } from "react";
import { useRouter } from "next/router";
import { Container, Form, Button, Alert } from "react-bootstrap";

const validateUser = (user) => {
    let errors = {};
    let isValid = true;
    if (user.username.trim() === "") {
        errors = "Username cannot be empty";
        isValid = false;
    }
    if (user.password !== user.password2) {
        errors = "Passwords do not match!";
        isValid = false;
    }
    return [isValid, errors];
};

export default function LoginPage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({});
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const [isValid, errors] = validateUser(user);
        if (!isValid) {
            setError(errors);
            setIsLoading(false);
            return;
        }
        const response = await fetch("api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
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
        if (data.username !== user.username ||
            data.email !== user.email) {
            setError("Something unexpected went wrong!");
            setIsLoading(false);
            return;

        }
        setIsLoading(false);
        router.push("/login");
    };

    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (!name.includes("password")) value = value.trim();
        setUser({
            ...user,
            [name]: value,
        });
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        name="email"
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        name="username"
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter username" />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    onChange={handleChange}
                >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                    />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    onChange={handleChange}
                >
                    <Form.Label>Confirm your password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password2"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mb-3">
                    Register
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
        </Container>
    );
}
