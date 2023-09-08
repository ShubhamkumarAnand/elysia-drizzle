import { eq } from 'drizzle-orm';
import db from '../config/db';
import { users } from '../db/schema';
import { bodyObj } from '../../type';

export async function createUser(body: bodyObj) {
  const hashPassword = await Bun.password.hash(body.password);
  const user = await db
    .insert(users)
    .values({ email: body.email, password: hashPassword, username: body.username });
  return `You are signed Up ${user}`;
}

export async function updateUser(body: bodyObj, id: string) {
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

export async function removeUser(id: string) {
  const allUser = await db.select().from(users);
  const getUser = allUser.find((user) => user.id === +id);

  if (!getUser) {
    return `User with ${id} does not exit`;
  }
  const user = await db.delete(users).where(eq(users.id, +id));
  return user;
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function getUser(id: string) {
  const listOfUsers = await db.select().from(users);
  const user = listOfUsers.find((user) => user.id === +id);
  if (!user) {
    return `User with ${id} does not exits.`;
  }
  return `Email: ${user.email}\nUsername: ${user.username}`;
}
