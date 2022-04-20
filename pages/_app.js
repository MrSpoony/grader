// import useSession from "@lib/session"
import "./_app.css";

export default function App({ Component, pageProps }) {
    // const session = useSession()
    // const newPageProps = {
    //     ...pageProps,
    //     session
    // }
    return (
        <>
            <main className="page">
                <Component {...newPageProps} />
            </main>
        </>
    );
}
