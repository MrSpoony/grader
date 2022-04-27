import { useState, useEffect } from "react";

export default function useData() {
    const [data, setData] = useState({});
    const [roles, setRoles] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [testgrouptypes, setTestgrouptypes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [testgroups, setTestgroups] = useState({});

    useEffect(() => {
        const loadRoles = async () => {
            const response = await fetch("/api/role");
            if (!response.ok) throw new Error(response.status);
            const roles = await response.json();
            setRoles(roles);
        };
        const loadStatuses = async () => {
            const response = await fetch("/api/status");
            if (!response.ok) throw new Error(response.status);
            const statuses = await response.json();
            setStatuses(statuses);
        };
        const loadTestgrouptypes = async () => {
            const response = await fetch("/api/testgrouptype");
            if (!response.ok) throw new Error(response.status);
            const testgrouptypes = await response.json();
            setTestgrouptypes(testgrouptypes);
        };
        const loadTasks = async () => {
            const response = await fetch("/api/task");
            if (!response.ok) throw new Error(response.status);
            const tasks = await response.json();
            setTasks(tasks);
        };
        const loadTestgroups = async () => {
            const response = await fetch("/api/testgroup");
            if (!response.ok) throw new Error(response.status);
            const testgroups = await response.json();
            setTestgroups(testgroups);
        };

        loadRoles();
        loadStatuses();
        loadTestgrouptypes();
        loadTasks();
        loadTestgroups();
    }, []);

    useEffect(() => {
        setData(d => {
            return {
                ...d,
                roles,
                statuses,
                testgrouptypes,
                tasks,
                testgroups
            };
        });
    }, [roles, statuses, tasks, testgroups, testgrouptypes]);

    return data;
}
