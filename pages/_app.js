import useData from "@lib/hooks/useData"

import React, { useState, useEffect } from "react";

export default function App({ Component, pageProps }) {
    const [session, setSession] = useState({});
    const data = useData();

    useEffect(() => {
        const fetchSession = async () => {
            const response = await fetch("/api/session");
            const data = await response.json();
            setSession(data);
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
            <main className="page">
                <h1>Data:</h1>
                <pre>{JSON.stringify(newPageProps.data, null, 2)}</pre>
                <h1>Session:</h1>
                <pre>{JSON.stringify(session, null, 2)}</pre>
                <Component {...newPageProps} />
            </main>
        </>
    );
}
