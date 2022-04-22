import React, { useState, useEffect } from "react";
import Header from "@components/Header";
import "bootstrap/dist/css/bootstrap.css";
import useData from "@lib/hooks/useData";

export default function App({ Component, pageProps }) {
    const [session, setSession] = useState({});
    const data = useData();

    useEffect(() => {
        const fetchSession = async () => {
            const response = await fetch("/api/session");
            const data = await response.json();
            setSession(data.session);
        };
        fetchSession();
    }, []);

    const newPageProps = {
        ...pageProps,
        data,
        session
    };

    return (
        <>
            <Header session={session}/>
            <br/>
            <br/>
            <br/>
            <main>
                <Component {...newPageProps} />
            </main>
        </>
    );
}
