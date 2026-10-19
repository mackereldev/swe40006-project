import "./App.css";

function App() {
    return (
        <>
            <h1>Guest Book</h1>
            <main>
                <section>
                    <h2>Leave a Message</h2>
                    <form className="entry-form">
                        <label>
                            author
                            <input type="text" name="author" />
                        </label>
                        <label>
                            body
                            <textarea name="body" rows={6} style={{ resize: "none" }}></textarea>
                        </label>
                        <button type="submit">submit</button>
                    </form>
                </section>
                <div className="divider" />
                <section>
                    <h2>Entries</h2>
                </section>
            </main>
        </>
    );
}

export default App;
