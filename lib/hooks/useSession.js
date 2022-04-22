import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function useSession() {
    const [session, setSession] = useState({});

    const reloadSession = async () => {
        const response = await fetch("/api/session");
        const data = await response.json();
        setSession(data.session);
    };

    const destroySession = async () => {
        const response = await fetch("/api/logout");
        const data = await response.json();
        setSession(data.session);
    };

    useEffect(() => {
        reloadSession();
    }, []);

    return {
        ...session,
        reloadSession,
        logout: destroySession,
    };
}

export function useRedirectToLogin(session) {
    const router = useRouter();
    useEffect(() => {
        if (session || session.user) router.push("/login");
    }, [session, router]);
}

export function useRedirectToHome(session) {
    const router = useRouter();
    useEffect(() => {
        if (!session || !session.user) router.push("/");
    }, [session, router]);
}
