import { Elysia, t } from "elysia";

function signIn(body: unknown) {
  console.log(body)
}
const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/sign-up", ({ body }) => ({
    message: `${body.username}`
  }), {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      email: t.String()
    })
  })
  .post("/log-in", ({ body }) => signIn(body), {
    body: t.Object({
      username: t.String(),
      password: t.String()
    })
  })
  .get("/dashboard/:name", (({ params: { name } }) => ({
    message: `Here is your dashboard with ${name}`
  })))
  .listen(3005)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
