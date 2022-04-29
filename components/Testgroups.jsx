import React from "react";
import Loading from "./Loading";

export default function Testgroups({ testgroups, testgrouptypes}) {
    if (!testgroups || !testgrouptypes) return <Loading/>;
    return (
        <>
            <h4>
                There are {testgroups.length-1} testgroups:
            </h4>
            <h5>Limits:</h5>
            <ul>
                {
                    testgroups.map((tg, i) => {
                        if (testgrouptypes.find(tgt => {
                            return tgt.id === tg.testgrouptype_id;
                        })?.type === "sample") return "";
                        return (<li key={tg.key}>
                                    Testgroup {i+1}: {tg.limits}
                        </li>);
                    })
                }
            </ul>
            <h5>Timelimits:</h5>
            <ul>
                {
                    testgroups.map((tg, i) => {
                        if (testgrouptypes.find(tgt => {
                            return tgt.id === tg.testgrouptype_id;
                        })?.type === "sample") return "";
                        return (<li key={tg.key}>
                                    Testgroup {i+1}: {tg.timelimit}ms
                        </li>);
                    })
                }
            </ul>
        </>
    );
}
