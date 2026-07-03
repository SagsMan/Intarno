import { db } from "./index";
import { adminUsersTable } from "./schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

async function main() {
  const email = "softwareclone100@gmail.com";
  const password = "123456";
  const name = "Intarno Admin";

  const existing = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("Admin already exists, updating password...");
    const passwordHash = await hashPassword(password);
    await db.update(adminUsersTable).set({ passwordHash, name }).where(eq(adminUsersTable.email, email));
    console.log("✓ Admin password updated");
  } else {
    const passwordHash = await hashPassword(password);
    await db.insert(adminUsersTable).values({ email, passwordHash, name });
    console.log("✓ Admin user created:", email);
  }
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
