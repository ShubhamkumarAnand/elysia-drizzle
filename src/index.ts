import { Elysia, t } from "elysia";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from "postgres";
import { users } from "../drizzle/schema";

const dbUrl = process.env.RAILWAY_DB_URL as string

const client = postgres(dbUrl)
const db = drizzle(client)

const allUser = await db.select().from(users);

interface body {
  id?: number
  full_name: string,
  phone: string
};

async function signIn(body: body) {
  const allUsers = await db.select().from(users)
  const getUser = allUsers.find(user => user.full_name === body.full_name)
  if (getUser) {
    return `You are logged in successfully.`
  }
  return `Invalid credentials`
}

async function signUp(body: body) {
  await db.insert(users).values({ id: body.id, full_name: body.full_name, phone: body.phone })
  return `You are signed Up`
}

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/users", () => ({
    users: allUser
  }))
  .post("/sign-up", ({ body }) => signUp(body), {
    body: t.Object({
      id: t.Number(),
      full_name: t.String(),
      phone: t.String()
    })
  })
  .post("/sign-in", ({ body }) => signIn(body), {
    body: t.Object({
      full_name: t.String(),
      phone: t.String()
    })
  })
  .get("/dashboard/:name", (({ params: { name } }) => ({
    message: `Here is your dashboard with ${name}`
  })))
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
