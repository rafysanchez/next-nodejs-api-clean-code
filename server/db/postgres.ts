import dotenv from 'dotenv';
import { Pool } from 'pg';
import { INITIAL_USERS } from './seedUsers.ts';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({ connectionString })
  : new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT || 5432),
      database: process.env.POSTGRES_DB || 'usersdb',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
    });

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
      bio TEXT NOT NULL DEFAULT '',
      avatar_color TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `);

  const { rows } = await pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');
  if (Number(rows[0]?.count || 0) > 0) {
    return;
  }

  for (const user of INITIAL_USERS) {
    await pool.query(
      `
        INSERT INTO users (
          id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        user.id,
        user.name,
        user.email,
        user.role,
        user.department,
        user.phone,
        user.status,
        user.bio || '',
        user.avatarColor,
        user.createdAt,
        user.updatedAt,
      ]
    );
  }
}
