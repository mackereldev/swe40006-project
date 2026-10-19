import { Fragment, type SubmitEvent, useEffect, useState } from "react";
import wretch from "wretch";
import "./App.css";

interface Entry {
    id: number;
    author: string;
    body: string;
    createdAt: number;
}

const api = wretch().url(import.meta.env.VITE_API_URL);

const authorPlaceholder = "Anonymous";

function App() {
    function updateEntries() {
        api.url("/entry").get().json((json) => {
            setEntries(json["entries"]);
        });
    }

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const author = formData.get("author")?.toString().trim();
        const body = formData.get("body")?.toString();

        if (author !== undefined && body !== undefined) {
            api.url("/entry")
                .json({
                    author: author != "" ? author : authorPlaceholder,
                    body,
                })
                .post()
                .res(() => updateEntries());
        }
    }

    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(updateEntries, []);

    return (
        <>
            <h1>Guest Book</h1>
            <main>
                <section className="entry-form-section">
                    <h2>Leave a Message!</h2>
                    <form className="entry-form" onSubmit={handleSubmit}>
                        <label>
                            author
                            <input type="text" name="author" placeholder="Anonymous" />
                        </label>
                        <label>
                            body
                            <textarea name="body" rows={6} style={{ resize: "none" }} required></textarea>
                        </label>
                        <button type="submit">submit</button>
                    </form>
                </section>
                <div className="divider" />
                <section>
                    <h2>Entries</h2>
                    <div className="entry-list">
                        {entries.map((entry, index) => (
                            <Fragment key={entry.id}>
                                <div className="entry">
                                    <div className="entry-header">
                                        <span>{entry.author}</span>
                                        <span>&nbsp;-&nbsp;</span>
                                        <span title={new Date(entry.createdAt).toLocaleString()}>
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="entry-body">{entry.body}</p>
                                </div>
                                {index < entries.length - 1 && <div className="divider" />}
                            </Fragment>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
