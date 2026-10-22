import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { createEntry, getEntries, getEntryById } from "../../src/dal.js";
import { clearEntries, closeDatabase, hasDatabase } from "../helpers/db.js";

describe.skipIf(!hasDatabase)("integration: API + PostgreSQL", () => {
    beforeEach(async () => {
        await clearEntries();
    });

    afterAll(async () => {
        await clearEntries();
        await closeDatabase();
    });

    describe("data access layer", () => {
        it("creates an entry and reads it back by id", async () => {
            const created = await createEntry("Hung", "Hello from the DAL");
            expect(created).toMatchObject({ author: "Hung", body: "Hello from the DAL" });
            expect(created.id).toBeTypeOf("number");
            expect(created.createdAt).toBeTruthy();

            const found = await getEntryById(created.id);
            expect(found).toEqual(created);
        });

        it("returns no entries for an empty table", async () => {
            expect(await getEntries()).toEqual([]);
        });

        it("returns nothing for an id that does not exist", async () => {
            expect(await getEntryById(999999)).toBeFalsy();
        });
    });

    describe("HTTP API", () => {
        it("saves a posted entry so it appears in the entry list", async () => {
            const post = await request(app)
                .post("/entry")
                .send({ author: "  Saba  ", body: "  First!  " })
                .expect(201);

            expect(post.body).toMatchObject({ author: "Saba", body: "First!" });

            const list = await request(app).get("/entry").expect(200);
            expect(list.body.entries).toHaveLength(1);
            expect(list.body.entries[0]).toMatchObject({ id: post.body.id, author: "Saba", body: "First!" });
        });

        it("fetches a saved entry by id", async () => {
            const post = await request(app).post("/entry").send({ body: "Find me" }).expect(201);

            const res = await request(app).get(`/entry?id=${post.body.id}`).expect(200);
            expect(res.body).toMatchObject({ id: post.body.id, author: "Anonymous", body: "Find me" });
        });

        it("returns 404 for an id that does not exist", async () => {
            await request(app).get("/entry?id=999999").expect(404);
        });

        it("does not save invalid entries", async () => {
            await request(app).post("/entry").send({ author: "Hung" }).expect(400);
            await request(app).post("/entry").send({ body: "" }).expect(400);

            const list = await request(app).get("/entry").expect(200);
            expect(list.body.entries).toEqual([]);
        });
    });
});
