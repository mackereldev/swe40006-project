import cors from "cors";
import express from "express";
import { createEntry, getEntries, getEntryById } from "./dal.js";
import { parseEntryId, validateEntry } from "./validation.js";

export const app = express();

app
    .use(cors({
        origin: process.env.NODE_ENV === "production" ? process.env.PROD_FRONTEND_ORIGIN : "http://localhost",
        allowedHeaders: ["Content-Type", "Authorization"],
    }))
    .use(express.json());

app.get("/", (_, res) => {
    res.sendStatus(200);
});

app.get("/entry", async (req, res) => {
    try {
        if (Object.keys(req.query).length == 0) {
            res.json({ entries: await getEntries() });
            return;
        }

        if (req.query["id"] === undefined) {
            res.json({ entries: [] });
            return;
        }

        const id = parseEntryId(req.query["id"]);
        if (id === null) {
            res.status(400).json({ errors: ["id must be a positive whole number"] });
            return;
        }

        const entry = await getEntryById(id);
        if (entry) {
            res.json(entry);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/entry", async (req, res) => {
    const result = validateEntry(req.body);
    if (!result.ok) {
        res.status(400).json({ errors: result.errors });
        return;
    }

    try {
        const entry = await createEntry(result.value.author, result.value.body);
        res.status(201).json(entry);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
