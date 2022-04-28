import React, { useEffect, useState } from "react";
import Highlight from "react-highlight";

export default function Source({ submission }) {
    const [source, setSource] = useState("");

    useEffect(() => {
        if (!submission?.code) return;
        setSource(submission.code);
    }, [submission?.code]);


    if (!submission) return (<>Loading</>);

    return (
        <>
            <h3>Source</h3>
            <Highlight className="c++ cpp">{source}</Highlight>
        </>
    );
}
