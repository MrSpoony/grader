import {
    Navbar,
    Nav,
    NavDropdown,
    Container,
} from "react-bootstrap";
import Link from "next/link";
import React from "react";

export default function Header({ session }) {

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand>Grader</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: "100px" }}
                        navbarScroll
                    >
                        <Link href="/" passHref>
                            <Nav.Link>Tasks</Nav.Link>
                        </Link>
                        <Link href="/submit" passHref>
                            <Nav.Link>Submit</Nav.Link>
                        </Link>
                    </Nav>
                    {
                        (session && session.user) ?
                            <NavDropdown
                                title={session.user.username}
                                id="navbarScrollingDropdown"
                            >
                                <NavDropdown.Item href="/settings">
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/logout">
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            :
                            <Link href="/login" passHref>
                                <Nav.Link>Login</Nav.Link>
                            </Link>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
