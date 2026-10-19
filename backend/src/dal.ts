import { db } from "./prisma/db.js";

export async function createEntry(author: string, body: string) {
    return await db.orm.public.Entry.create({
        author,
        body,
    });
}

export async function getEntries() {
    return await db.orm.public.Entry.orderBy((e) => e.createdAt.desc()).all();
}

export async function getEntryById(id: number) {
    return await db.orm.public.Entry.whereUnique({ id }).first();
}
