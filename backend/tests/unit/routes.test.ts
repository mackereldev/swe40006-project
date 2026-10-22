import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/dal.js", () => ({
    createEntry: vi.fn(),
    getEntries: vi.fn(),
    getEntryById: vi.fn(),
}));

const dal = await import("../../src/dal.js");
const { app } = await import("../../src/app.js");

const createEntry = vi.mocked(dal.createEntry);
const getEntries = vi.mocked(dal.getEntries);
const getEntryById = vi.mocked(dal.getEntryById);

const sampleEntry = { id: 1, author: "Hung", body: "Hello", createdAt: "2026-10-21 05:00:00" };

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("GET /", () => {
    it("responds 200 for health checks", async () => {
        await request(app).get("/").expect(200);
    });
});

describe("GET /entry", () => {
    it("returns all entries", async () => {
        getEntries.mockResolvedValue([sampleEntry] as never);
        const res = await request(app).get("/entry").expect(200);
        expect(res.body).toEqual({ entries: [sampleEntry] });
    });

    it("returns 500 when the database fails", async () => {
        getEntries.mockRejectedValue(new Error("db down"));
        await request(app).get("/entry").expect(500);
    });

    it("returns an empty list for unrecognised query parameters", async () => {
        const res = await request(app).get("/entry?foo=bar").expect(200);
        expect(res.body).toEqual({ entries: [] });
        expect(getEntries).not.toHaveBeenCalled();
    });

    it("returns a single entry by id", async () => {
        getEntryById.mockResolvedValue(sampleEntry as never);
        const res = await request(app).get("/entry?id=1").expect(200);
        expect(res.body).toEqual(sampleEntry);
        expect(getEntryById).toHaveBeenCalledWith(1);
    });

    it("returns 404 when the entry does not exist", async () => {
        getEntryById.mockResolvedValue(null as never);
        await request(app).get("/entry?id=999").expect(404);
    });

    it("returns 400 for a malformed id without querying the database", async () => {
        await request(app).get("/entry?id=abc").expect(400);
        expect(getEntryById).not.toHaveBeenCalled();
    });

    it("returns 500 when looking up by id fails", async () => {
        getEntryById.mockRejectedValue(new Error("db down"));
        await request(app).get("/entry?id=1").expect(500);
    });
});

describe("POST /entry", () => {
    it("creates a valid entry with trimmed fields and returns 201", async () => {
        createEntry.mockResolvedValue(sampleEntry as never);
        const res = await request(app).post("/entry").send({ author: " Hung ", body: " Hello " }).expect(201);
        expect(res.body).toEqual(sampleEntry);
        expect(createEntry).toHaveBeenCalledWith("Hung", "Hello");
    });

    it("uses Anonymous when no author is given", async () => {
        createEntry.mockResolvedValue(sampleEntry as never);
        await request(app).post("/entry").send({ body: "Hello" }).expect(201);
        expect(createEntry).toHaveBeenCalledWith("Anonymous", "Hello");
    });

    it("returns 400 with error messages for invalid input", async () => {
        const res = await request(app).post("/entry").send({ author: "Hung", body: "   " }).expect(400);
        expect(res.body).toEqual({ errors: ["body must not be empty"] });
        expect(createEntry).not.toHaveBeenCalled();
    });

    it("returns 400 when no JSON body is sent", async () => {
        await request(app).post("/entry").expect(400);
        expect(createEntry).not.toHaveBeenCalled();
    });

    it("returns 500 when the database fails", async () => {
        createEntry.mockRejectedValue(new Error("db down"));
        await request(app).post("/entry").send({ body: "Hello" }).expect(500);
    });
});
