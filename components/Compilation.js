import React, { useEffect, useState } from "react";
import Highlight from "react-highlight";

export default function Compilation({ submission }) {
    const [compilation, setCompilation] = useState("");

    useEffect(() => {
        if (!submission?.compilation_text) return;
        setCompilation(submission.compilation_text);
    }, [submission?.compilation_text]);


    if (!submission) return (<>Loading</>);

    return (
        <>
            <h3>Compiler command</h3>
            <Highlight className="c++ cpp">
                {
                    "g++-10 -Wall -Wextra -fdiagnostics-color=never " + 
                    "-Wno-sign-compare -std=c++20 -O2 -static " + 
                    "submission.cpp -o submission"
                }
            </Highlight>
            <h3>Compiler output</h3>
            <Highlight className="c++ cpp">{compilation}</Highlight>
        </>
    );
}
