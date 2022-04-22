import React from "react";
import Header from "@components/Header";
import "bootstrap/dist/css/bootstrap.css";
import useData from "@lib/hooks/useData";
import useSession from "@lib/hooks/useSession";

export default function App({ Component, pageProps }) {
    const data = useData();
    const session = useSession();

    const newPageProps = {
        ...pageProps,
        data,
        session
    };

    return (
        <>
            <Header session={session}/>
            <br/>
            <br/>
            <br/>
            <main>
                <Component {...newPageProps} />
            </main>
        </>
    );
}
