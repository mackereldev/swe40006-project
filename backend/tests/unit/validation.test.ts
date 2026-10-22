import { describe, expect, it } from "vitest";
import {
    AUTHOR_MAX_LENGTH,
    BODY_MAX_LENGTH,
    DEFAULT_AUTHOR,
    parseEntryId,
    validateEntry,
} from "../../src/validation.js";

describe("validateEntry", () => {
    it("accepts a valid entry and trims whitespace", () => {
        expect(validateEntry({ author: "  Hung  ", body: "  Hello!  " })).toEqual({
            ok: true,
            value: { author: "Hung", body: "Hello!" },
        });
    });

    it("allows authors up to 50 characters and bodies up to 1000 characters", () => {
        expect(validateEntry({ author: "a".repeat(50), body: "b".repeat(1000) }).ok).toBe(true);
        expect(validateEntry({ author: "a".repeat(51), body: "hi" }).ok).toBe(false);
        expect(validateEntry({ body: "b".repeat(1001) }).ok).toBe(false);
    });

    it.each([
        ["missing", { body: "hi" }],
        ["null", { author: null, body: "hi" }],
        ["empty", { author: "", body: "hi" }],
        ["whitespace only", { author: "   ", body: "hi" }],
    ])("defaults the author to Anonymous when it is %s", (_, input) => {
        const result = validateEntry(input);
        expect(result).toEqual({ ok: true, value: { author: DEFAULT_AUTHOR, body: "hi" } });
    });

    it.each([
        ["undefined", undefined],
        ["null", null],
        ["a string", "hello"],
        ["an array", [{ body: "hi" }]],
    ])("rejects a request body that is %s", (_, input) => {
        expect(validateEntry(input)).toEqual({ ok: false, errors: ["request body must be a JSON object"] });
    });

    it("rejects a missing body", () => {
        expect(validateEntry({ author: "Hung" })).toEqual({ ok: false, errors: ["body is required"] });
    });

    it("rejects a null body", () => {
        expect(validateEntry({ body: null })).toEqual({ ok: false, errors: ["body is required"] });
    });

    it.each(["", "   ", "\n\t"])("rejects a blank body (%j)", (body) => {
        expect(validateEntry({ body })).toEqual({ ok: false, errors: ["body must not be empty"] });
    });

    it("rejects a body that is not a string", () => {
        expect(validateEntry({ body: 42 })).toEqual({ ok: false, errors: ["body must be a string"] });
    });

    it("rejects an author that is not a string", () => {
        expect(validateEntry({ author: 42, body: "hi" })).toEqual({
            ok: false,
            errors: ["author must be a string"],
        });
    });

    it("accepts fields exactly at the length limits", () => {
        const author = "a".repeat(AUTHOR_MAX_LENGTH);
        const body = "b".repeat(BODY_MAX_LENGTH);
        expect(validateEntry({ author, body })).toEqual({ ok: true, value: { author, body } });
    });

    it("rejects fields over the length limits", () => {
        const result = validateEntry({
            author: "a".repeat(AUTHOR_MAX_LENGTH + 1),
            body: "b".repeat(BODY_MAX_LENGTH + 1),
        });
        expect(result).toEqual({
            ok: false,
            errors: [
                `author must be at most ${AUTHOR_MAX_LENGTH} characters`,
                `body must be at most ${BODY_MAX_LENGTH} characters`,
            ],
        });
    });

    it("measures length after trimming", () => {
        const body = `  ${"b".repeat(BODY_MAX_LENGTH)}  `;
        expect(validateEntry({ body }).ok).toBe(true);
    });

    it("reports every problem at once", () => {
        const result = validateEntry({ author: 1, body: 2 });
        expect(result).toEqual({ ok: false, errors: ["author must be a string", "body must be a string"] });
    });
});

describe("parseEntryId", () => {
    it.each([
        ["1", 1],
        ["42", 42],
        ["007", 7],
    ])("parses %j as %i", (raw, expected) => {
        expect(parseEntryId(raw)).toBe(expected);
    });

    it.each(["", "abc", "12abc", "-1", "1.5", "0", " 1", "99999999999999999999"])("rejects %j", (raw) => {
        expect(parseEntryId(raw)).toBeNull();
    });

    it.each([undefined, 1, ["1", "2"], { id: "1" }])("rejects non-string value %j", (raw) => {
        expect(parseEntryId(raw)).toBeNull();
    });
});
