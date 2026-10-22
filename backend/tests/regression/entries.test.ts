import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { clearEntries, closeDatabase, hasDatabase } from "../helpers/db.js";

describe.skipIf(!hasDatabase)("regression: guestbook requirements", () => {
    beforeEach(async () => {
        await clearEntries();
    });

    afterAll(async () => {
        await clearEntries();
        await closeDatabase();
    });

    it("lists entries newest first", async () => {
        for (const body of ["first", "second", "third"]) {
            await request(app).post("/entry").send({ body }).expect(201);
        }

        const res = await request(app).get("/entry").expect(200);
        const bodies = res.body.entries.map((entry: { body: string }) => entry.body);
        expect(bodies).toEqual(["third", "second", "first"]);
    });

    it("rejects a non-numeric id with a single 400 response", async () => {
        const res = await request(app).get("/entry?id=abc").expect(400);
        expect(res.body).toEqual({ errors: ["id must be a positive whole number"] });
    });

    it("does not treat a partly numeric id as a real id", async () => {
        const post = await request(app).post("/entry").send({ body: "Hello" }).expect(201);
        await request(app).get(`/entry?id=${post.body.id}abc`).expect(400);
    });

    it("stores a blank author as Anonymous", async () => {
        await request(app).post("/entry").send({ author: "   ", body: "Hi" }).expect(201);
        const res = await request(app).get("/entry").expect(200);
        expect(res.body.entries[0].author).toBe("Anonymous");
    });
});
