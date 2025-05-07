import type { APIRoute } from 'astro';
import { connect } from '../../lib/db';

export const prerender = false;

// GET /api/todos — list all todos
export const GET: APIRoute = async () => {
  const db = await connect();
  const { rows } = await db.query('SELECT * FROM todos ORDER BY created_at DESC');
  return new Response(JSON.stringify(rows), { status: 200 });
};

// POST /api/todos — create a new todo
export const POST: APIRoute = async ({ request }) => {
  const { title } = await request.json();
  const db = await connect();
  const { rows } = await db.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  );
  return new Response(JSON.stringify(rows[0]), { status: 201 });
};

// PATCH /api/todos — toggle completion
// Body: { id: number; completed: boolean }
export const PATCH: APIRoute = async ({ request }) => {
  const { id, completed } = await request.json();
  const db = await connect();
  const { rows } = await db.query(
    'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
    [completed, id]
  );
  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Todo not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(rows[0]), { status: 200 });
};

// DELETE /api/todos — body: { id: number }
export const DELETE: APIRoute = async ({ request }) => {
  const { id } = await request.json();
  const db = await connect();
  await db.query('DELETE FROM todos WHERE id = $1', [id]);
  return new Response(null, { status: 204 });
};
