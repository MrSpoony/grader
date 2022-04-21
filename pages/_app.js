import React from "react";

export default function App({ Component, pageProps }) {
    return (
        <>
            <main className="page">
                <Component {...pageProps} />
            </main>
        </>
    );
}
