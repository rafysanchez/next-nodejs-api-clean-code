import {
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserQueryParams,
  UserStats,
  UserStatus,
} from '../types/user.ts';
import { pool } from './postgres.ts';
import { AVATAR_COLORS, INITIAL_USERS } from './seedUsers.ts';

const SORT_COLUMNS: Record<string, string> = {
  id: 'id',
  name: 'name',
  email: 'email',
  role: 'role',
  department: 'department',
  phone: 'phone',
  status: 'status',
  bio: 'bio',
  avatarColor: 'avatar_color',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  department: User['department'];
  phone: string;
  status: UserStatus;
  bio: string;
  avatar_color: string;
  created_at: Date;
  updated_at: Date;
};

function mapRow(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    phone: row.phone,
    status: row.status,
    bio: row.bio,
    avatarColor: row.avatar_color,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

class PostgresUserRepository {
  public async findAll(params: UserQueryParams = {}): Promise<{ data: User[]; total: number }> {
    const { search, role, department, status, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const conditions: string[] = [];
    const values: Array<string> = [];

    if (search && search.trim()) {
      values.push(`%${search.trim().toLowerCase()}%`);
      const idx = values.length;
      conditions.push(
        `(LOWER(name) LIKE $${idx} OR LOWER(email) LIKE $${idx} OR LOWER(role) LIKE $${idx} OR LOWER(department) LIKE $${idx} OR LOWER(phone) LIKE $${idx})`
      );
    }

    if (role && role !== 'all') {
      values.push(role);
      conditions.push(`role = $${values.length}`);
    }

    if (department && department !== 'all') {
      values.push(department);
      conditions.push(`department = $${values.length}`);
    }

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.createdAt;
    const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const [listResult, countResult] = await Promise.all([
      pool.query<UserRow>(
        `
          SELECT id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
          FROM users
          ${whereClause}
          ORDER BY ${orderColumn} ${orderDirection}
        `,
        values
      ),
      pool.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM users ${whereClause}`, values),
    ]);

    return {
      data: listResult.rows.map(mapRow),
      total: Number(countResult.rows[0]?.count || 0),
    };
  }

  public async findById(id: string): Promise<User | null> {
    const result = await pool.query<UserRow>(
      `
        SELECT id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
        FROM users
        WHERE id = $1
      `,
      [id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<UserRow>(
      `
        SELECT id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
      `,
      [email.trim()]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  public async create(dto: CreateUserDTO): Promise<User> {
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const now = new Date();
    const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const result = await pool.query<UserRow>(
      `
        INSERT INTO users (
          id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
      `,
      [
        id,
        dto.name.trim(),
        dto.email.trim().toLowerCase(),
        dto.role || 'Desenvolvedor',
        dto.department || 'Tecnologia',
        dto.phone ? dto.phone.trim() : '',
        dto.status || 'active',
        dto.bio ? dto.bio.trim() : '',
        randomColor,
        now,
        now,
      ]
    );

    return mapRow(result.rows[0]);
  }

  public async update(id: string, dto: UpdateUserDTO): Promise<User | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const result = await pool.query<UserRow>(
      `
        UPDATE users
        SET
          name = $2,
          email = $3,
          role = $4,
          department = $5,
          phone = $6,
          status = $7,
          bio = $8,
          updated_at = $9
        WHERE id = $1
        RETURNING id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
      `,
      [
        id,
        dto.name !== undefined ? dto.name.trim() : existing.name,
        dto.email !== undefined ? dto.email.trim().toLowerCase() : existing.email,
        dto.role || existing.role,
        dto.department || existing.department,
        dto.phone !== undefined ? dto.phone.trim() : existing.phone,
        dto.status || existing.status,
        dto.bio !== undefined ? dto.bio.trim() : existing.bio || '',
        new Date(),
      ]
    );

    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  public async updateStatus(id: string, status: UserStatus): Promise<User | null> {
    const result = await pool.query<UserRow>(
      `
        UPDATE users
        SET status = $2, updated_at = $3
        WHERE id = $1
        RETURNING id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
      `,
      [id, status, new Date()]
    );

    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  public async delete(id: string): Promise<User | null> {
    const result = await pool.query<UserRow>(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING id, name, email, role, department, phone, status, bio, avatar_color, created_at, updated_at
      `,
      [id]
    );

    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  public async getStats(): Promise<UserStats> {
    const [countRows, roleRows, departmentRows] = await Promise.all([
      pool.query<{ total: string; active: string; inactive: string; pending: string }>(`
        SELECT
          COUNT(*)::text AS total,
          COUNT(*) FILTER (WHERE status = 'active')::text AS active,
          COUNT(*) FILTER (WHERE status = 'inactive')::text AS inactive,
          COUNT(*) FILTER (WHERE status = 'pending')::text AS pending
        FROM users
      `),
      pool.query<{ role: string; count: string }>(`
        SELECT role, COUNT(*)::text AS count
        FROM users
        GROUP BY role
      `),
      pool.query<{ department: string; count: string }>(`
        SELECT department, COUNT(*)::text AS count
        FROM users
        GROUP BY department
      `),
    ]);

    const totals = countRows.rows[0];
    const roles = Object.fromEntries(roleRows.rows.map((row) => [row.role, Number(row.count)]));
    const departments = Object.fromEntries(
      departmentRows.rows.map((row) => [row.department, Number(row.count)])
    );

    return {
      total: Number(totals?.total || 0),
      active: Number(totals?.active || 0),
      inactive: Number(totals?.inactive || 0),
      pending: Number(totals?.pending || 0),
      roles,
      departments,
    };
  }

  public async reset(): Promise<User[]> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(918273645)');
      await client.query('TRUNCATE TABLE users');

      for (const user of INITIAL_USERS) {
        await client.query(
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

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const result = await this.findAll({ sortBy: 'createdAt', sortOrder: 'asc' });
    return result.data;
  }
}

export const userRepository = new PostgresUserRepository();
