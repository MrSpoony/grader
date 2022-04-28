import React, { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import ReactDiffViewer from "react-diff-viewer";
import Link from "next/link";


export default function Source({
    submission,
    testgrouptypes,
    statuses,
    tasks
}) {
    const [testcaseStatuses, setTestcaseStatuses] = useState([]);
    const [samples, setSamples] = useState([]);
    const [reals, setReals] = useState([]);
    const [inactive, setInactive] = useState({});
    const [task, setTask] = useState({});

    useEffect(() => {
        if (!tasks || !submission?.task_id) return;
        setTask(tasks.find(t => t.id === submission.task_id));
    }, [tasks, submission?.task_id]);

    useEffect(() => {
        if (!testcaseStatuses ||
            !task.testgroups ||
            !testgrouptypes) return;
        setSamples(testcaseStatuses.filter(ts => {
            return ts.testcase.testgroup.testgrouptype.type === "sample";
        }));
    
        const testgroups = task.testgroups;
        if (typeof(testgroups) !== typeof([])) return;
        let realGroups = testgroups.filter(tg => {
            return testgrouptypes.find(tgt => {
                return tgt.id === tg.testgrouptype_id;
            })?.type !== "sample";
        }).sort((a, b) => {
            return a.id - b.id;
        });
        const pseudoReals = testcaseStatuses.filter(ts => {
            return ts.testcase.testgroup.testgrouptype.type !== "sample";
        });
        realGroups.map(rg => {
            rg.testcase_statuses = pseudoReals.filter(pr => {
                return pr.testcase.testgroup.id === rg.id;
            });
            const firstNotSuccess = rg.testcase_statuses.find(ts => {
                return ts.status.toLowerCase() !== "sucess";
            });
            if (firstNotSuccess)
                rg.status = firstNotSuccess.status;
            else rg.status = "Success";
            return rg;
        });
        setReals(realGroups);
    }, [testcaseStatuses, testgrouptypes, task.testgroups]);

    useEffect(() => {
        if (!reals.length || !samples.length) return;
        let realInactives = {};
        Object.entries(reals).forEach(k => {
            realInactives[k[1].id] = true;
        });
        Object.entries(samples).forEach(k => {
            realInactives[`S.${k[1].id}`] = true;
        });
        setInactive(realInactives);
    }, [reals, samples]);

    useEffect(() => {
        if (!submission?.testcase_statuses ||
            !testgrouptypes ||
            !statuses) return;
        setTestcaseStatuses(submission.testcase_statuses.sort((a, b) => {
            if (testgrouptypes.find(tgt => {
                return tgt.id === a.testcase.testgroup;
            })?.type.toLowerCase() === "sample") return -1;
            if (testgrouptypes.find(tgt => {
                return tgt.id === b.testcase.testgroup;
            })?.type.toLowerCase() === "sample") return 1;
            const diffTestgroups = (a.testcase.testgroup.id - 
                    b.testcase.testgroup.id);
            if (diffTestgroups !== 0) return diffTestgroups;
            return a.testcase.id - b.testcase.id;
        }).map(el => {
            el.status = statuses.find(s => {
                return s.id === el.status_id;
            })?.status;
            return el;
        }));
    }, [submission?.testcase_statuses, testgrouptypes, statuses]);

    const toggleActive = index => {
        let updated = {...inactive};
        updated[index] = !updated[index];
        console.log(updated);
        setInactive(updated);
    };

    if (!testcaseStatuses.length ||
        !submission ||
        !testgrouptypes ||
        !statuses ||
        !samples ||
        !reals
    ) return (<>Loading</>);

    return (
        <>
            <h3>Grading</h3>
            <Table>{ submission && <>
                <thead>
                    <tr>
                        <th>Case</th>
                        <th>Verdict</th>
                        <th>More</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        samples?.map((ts, i) => {
                            return (<>
                                <tr key={ts.id}>
                                    <td>Sample.{String(i).padStart(2, "0")}</td>
                                    <td>
                                        <Badge bg={
                                            ts.status === "Success" ? "success" :
                                                ["Warning", "Pending"].includes(ts.status) ?
                                                    "warning" :
                                                    "danger"}>
                                            {ts.status}
                                        </Badge>
                                    </td>
                                    <td onClick={() => {
                                        toggleActive(`S.${ts.id}`);
                                    }}
                                    >
                                        <Link href="#">
                                            Diff
                                        </Link>
                                    </td>
                                </tr>
                                <tr
                                    className={inactive[`S.${ts.id}`] ? "collapse" : ""}
                                >
                                    <td colSpan="3">
                                        <ReactDiffViewer 
                                            oldValue={ts.testcase.output}
                                            newValue={ts.output ?
                                                ts.output :
                                                ts.testcase.output}
                                            splitView={true}
                                            showDiffOnly={false}
                                        />
                                    </td>
                                </tr>
                            </>);
                        })
                    }
                    {
                        reals?.map(tg => {
                            return (<>
                                <tr
                                    key={tg.id}
                                >
                                    <td>{String(tg.id).padStart(2, "0")}</td>
                                    <td>
                                        <Badge bg={
                                            tg.status === "Success" ? "success" :
                                                ["Warning", "Pending"].includes(tg.status) ?
                                                    "warning" :
                                                    "danger"}>
                                            {tg.status}
                                        </Badge>
                                    </td>
                                    <td onClick={() => toggleActive(tg.id)}>
                                        <Link href="#">
                                            More
                                        </Link>
                                    </td>
                                </tr>
                                {
                                    tg.testcase_statuses.map(ts => {
                                        return (<tr
                                            key={ts.id}
                                            className={inactive[tg.id] ? "collapse" : ""}
                                        >
                                            <td>{`${String(tg.id).padStart(2, "0")}.${String(ts.testcase.id).padStart(2, "0")}`}</td>
                                            <td>
                                                <Badge bg={
                                                    ts.status === "Success" ? "success" :
                                                        ["Warning", "Pending"].includes(ts.status) ? "warning" : "danger"}>
                                                    {ts.status}
                                                </Badge>
                                            </td>
                                            <td></td>
                                        </tr>);
                                    })
                                }
                            </>);
                        })
                    }
                </tbody>
            </>}</Table>
        </>
    );
}
