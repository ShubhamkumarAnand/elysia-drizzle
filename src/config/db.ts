import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const dbUrl = process.env.RAILWAY_DB_URL as string;

const client = postgres(dbUrl);
const db = drizzle(client);

export default db;
