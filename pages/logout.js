import React, { useEffect } from "react";
import { Alert, Container } from "react-bootstrap";
import { useRouter } from "next/router";

export default function LogoutPage({ session }) {
    const router = useRouter();
    
    useEffect(() => {
        session.logout();
        router.push("/");
    }, [router, session]);

    return (
        <Container>
            <Alert variant="info">
                Loggging you out
            </Alert>
        </Container>
    );
}
