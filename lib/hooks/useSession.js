import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function useSession() {
    const [session, setSession] = useState({});
    const [ready, setReady] = useState(false);

    const reloadSession = async () => {
        setReady(false);
        const response = await fetch("/api/session");
        if (!response.ok) {
            throw new Error(await response.json());
        }
        const data = await response.json();
        setSession(data.session);
        setReady(true);
    };

    const destroySession = async () => {
        const response = await fetch("/api/logout");
        if (!response.ok) {
            throw new Error(await response.json());
        }
        const data = await response.json();
        setSession(data.session);
        setSession(false);
    };

    useEffect(() => {
        reloadSession();
    }, []);

    return {
        ...session,
        reloadSession,
        ready,
        logout: destroySession,
    };
}

export function useRedirectToLogin(session) {
    const router = useRouter();
    useEffect(() => {
        if (session.ready && !session.user) router.push("/login");
    }, [session, router]);
}

export function useRedirectToHome(session) {
    const router = useRouter();
    useEffect(() => {
        if (session.ready && session.user) router.push("/");
    }, [session, router]);
}
