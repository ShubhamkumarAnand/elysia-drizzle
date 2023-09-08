import { Elysia, t } from 'elysia';
import { createUser, getAllUsers, getUser, removeUser, updateUser } from './handlers/users';
import { bodyObj } from '../type';

const app = new Elysia();

app.get('/', () => ({
  message: 'Hello Elysia with drizzle',
}));

app.get('/users', getAllUsers);

app.get('/user/:id', ({ params: { id } }) => getUser(id));

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
