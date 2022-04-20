const URL = "http://localhost:3001";

export async function login({ email, password }) {
    const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    return data;
}

export async function register({ email, password }) {
    const response = await fetch(`${URL}/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        return Promise.reject(response);
    }

    const data = await response.json();
    return data;
}