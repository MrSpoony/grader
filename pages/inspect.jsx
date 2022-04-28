import React from "react";

export default function InspectPage({ data, session}) {
    return (
        <>
            <h1>Data:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <h1>Session:</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
    );
}
