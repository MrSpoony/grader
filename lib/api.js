export async function doLogin(login) {
    const response = await fetch("api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...login,
            email: login.username
        })
    });
    if (!response.ok) {
        const { message } = await response.json();
        return Promise.reject(new Error(message || "Something unexpected went wrong!"));
    }
    await response.json();
}

export async function doRegister(user) {
    const response = await fetch("api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        const { message } = await response.json();
        return Promise.reject(new Error(message || "Something unexpected happened!"));
    }
    const data = await response.json();
    if (data.username !== user.username ||
            data.email !== user.email) {
        return Promise.reject(new Error("Something unexpected went wrong, the new username and " + 
                       "email Addresses do not match!"));
    }
}

export async function doDeleteSubmission(s) {
    const response = await fetch(`/api/submission/${s.id}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        let message = "";
        try {
            message = await response.json().message;
        } catch (e) {
            return Promise.reject(new Error(response.status || "Something unexpected went wrong!"));
        }
        return Promise.reject(new Error(message || "Somethig unexpected went wrong!"));
    }
    const data = await response.json();
    return data;
}

export async function updateSubmissionScore(s, score) {
    const response = await fetch(`/api/submission/${s.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: s.id,
            score: score,
        })
    });
    if (!response.ok) {
        let message = "";
        try {
            message = await response.json().message;
        } catch (e) {
            return Promise.reject(new Error(response.status));
        }
        return Promise.reject(new Error(response.status, message));
    }
}


export async function getSubmissions() {
    const response = await fetch("/api/submission");
    if (!response.ok) {
        let message = "";
        try {
            message = await response.json().message;
        } catch (e) {
            return Promise.reject(new Error(response.status));
        }
        return Promise.reject(new Error(response.status, message));
    }
    let data = await response.json();
    return data;
}

export async function getUsers() {
    const response = await fetch("/api/user");
    if (!response.ok) {
        let message = "";
        try {
            message = await response.json().message;
        } catch (e) {
            return Promise.reject(new Error(response.status));
        }
        return Promise.reject(new Error(response.status, message));
    }
    let data = await response.json();
    return data;
}


export async function doSubmit(submission) {
    const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
    });
    if (!response.ok) {
        return Promise.reject(new Error(await response.json().message || 
                "Something unexpected went wrong!"));
    }
    const subm = await response.json();
    return subm;
}

export async function getSampleCases(testgroupId) {
    const response = await fetch(`/api/testgroup/${testgroupId}`);
    if (!response.ok) return Promise.reject(new Error(await response.json() || 
                "Some unknown error occured"));
    const data = await response.json();
    return data;
}

export async  function getSubmissionDetail(id) {
    const response = await fetch(`/api/submission/${id}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        let message = "";
        try {
            message = await response.json().message;
        } catch (e) {
            return Promise.reject(new Error(response.status || "Some unknown error occured"));
        }
        return Promise.reject(new Error(message || "Some unknown error occured"));
    }
    const submission = await response.json();
    return submission;
}
