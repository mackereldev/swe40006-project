import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createEntry, getEntries, getEntryById } from "./dal.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app
    .use(cors())
    .use(express.json());

app.get("/entry", async (req, res) => {
    try {
        if (Object.keys(req.query).length == 0) {
            res.json({ entries: await getEntries() });
        } else {
            if (req.query["id"]) {
                const id = parseInt(req.query["id"].toString());
                if (isNaN(id)) {
                    res.sendStatus(404);
                }

                const entry = await getEntryById(id);
                if (entry) {
                    res.json(entry);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.json({ entries: [] });
            }
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/entry", async (req, res) => {
    const { author, body }: { author: string; body: string } = await req.body;

    if (author === undefined || body === undefined) {
        res.sendStatus(400);
    } else {
        try {
            res.json({ entries: await createEntry(author, body) });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
