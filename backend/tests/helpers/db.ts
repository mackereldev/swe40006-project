import { db } from "../../src/prisma/db.js";

/**
 * Integration and regression tests need a real PostgreSQL database (DATABASE_URL).
 * Without it these tests are skipped, and the coverage threshold will fail.
 */
export const hasDatabase = Boolean(process.env["DATABASE_URL"]);

/** Removes every guestbook entry so each test starts from an empty table. */
export async function clearEntries() {
    await db.orm.public.Entry.where((e) => e.id.gt(0)).deleteAll();
}

export async function closeDatabase() {
    await db.close();
}
