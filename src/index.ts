import { Elysia, t } from 'elysia';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const dbUrl = process.env.RAILWAY_DB_URL as string;

const client = postgres(dbUrl);
const db = drizzle(client);

interface bodyObj {
  id?: number;
  email: string;
  username: string;
  password: string;
}

async function createUser(body: bodyObj) {
  const hashPassword = await Bun.password.hash(body.password);
  const user = await db
    .insert(users)
    .values({ email: body.email, password: hashPassword, username: body.username });
  return `You are signed Up ${user}`;
}

async function updateUser(body: bodyObj, id: string) {
  const allUser = await db.select().from(users);
  const getUser = allUser.find((user) => user.id === +id);

  if (!getUser) {
    return `User with ${id} does not exit`;
  }

  const updatedUser = await db
    .update(users)
    .set({ email: body.email, username: body.username })
    .where(eq(users.id, +id));
  console.log(`User Created`);
  return updatedUser;
}

async function removeUser(id: string) {
  const allUser = await db.select().from(users);
  const getUser = allUser.find((user) => user.id === +id);

  if (!getUser) {
    return `User with ${id} does not exit`;
  }
  const user = await db.delete(users).where(eq(users.id, +id));
  return user;
}

async function getAllUsers() {
  return await db.select().from(users);
}

const app = new Elysia();

app.get('/', () => ({
  message: 'Hello Elysia with drizzle',
}));

app.get('/users', getAllUsers);

app.post('/user', ({ body }) => createUser(body), {
  body: t.Object({
    email: t.String(),
    username: t.String(),
    password: t.String(),
  }),
});

app.patch(
  '/user/:id',
  ({ params: { id }, body }) => {
    updateUser(body as bodyObj, id);
  },
  {
    body: t.Object({
      email: t.String(),
      username: t.String(),
    }),
  }
);

app.delete('/user/:id', ({ params: { id } }) => {
  removeUser(id);
});

app.listen(3000, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
