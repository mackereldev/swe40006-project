export const DEFAULT_AUTHOR = "Anonymous";
export const AUTHOR_MAX_LENGTH = 50;
export const BODY_MAX_LENGTH = 1000;

export interface EntryInput {
    author: string;
    body: string;
}

export type ValidationResult =
    | { ok: true; value: EntryInput }
    | { ok: false; errors: string[] };

export function validateEntry(input: unknown): ValidationResult {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
        return { ok: false, errors: ["request body must be a JSON object"] };
    }

    const { author, body } = input as Record<string, unknown>;
    const errors: string[] = [];

    let cleanAuthor = DEFAULT_AUTHOR;
    if (author !== undefined && author !== null) {
        if (typeof author !== "string") {
            errors.push("author must be a string");
        } else if (author.trim() !== "") {
            cleanAuthor = author.trim();
            if (cleanAuthor.length > AUTHOR_MAX_LENGTH) {
                errors.push(`author must be at most ${AUTHOR_MAX_LENGTH} characters`);
            }
        }
    }

    let cleanBody = "";
    if (body === undefined || body === null) {
        errors.push("body is required");
    } else if (typeof body !== "string") {
        errors.push("body must be a string");
    } else {
        cleanBody = body.trim();
        if (cleanBody === "") {
            errors.push("body must not be empty");
        } else if (cleanBody.length > BODY_MAX_LENGTH) {
            errors.push(`body must be at most ${BODY_MAX_LENGTH} characters`);
        }
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }
    return { ok: true, value: { author: cleanAuthor, body: cleanBody } };
}

export function parseEntryId(raw: unknown): number | null {
    if (typeof raw !== "string" || !/^\d+$/.test(raw)) {
        return null;
    }
    const id = Number(raw);
    if (!Number.isSafeInteger(id) || id < 1) {
        return null;
    }
    return id;
}
