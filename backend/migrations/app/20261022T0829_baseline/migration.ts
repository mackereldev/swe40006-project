#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/eb035a205df475ce11096d5f3296e7aca03e5fd23e386d61388bc150c4a46efa/contract';
import endContract from '../../snapshots/eb035a205df475ce11096d5f3296e7aca03e5fd23e386d61388bc150c4a46efa/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Entry',
        columns: [
          col('author', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('body', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
