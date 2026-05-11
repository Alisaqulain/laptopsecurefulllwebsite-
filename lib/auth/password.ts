import bcrypt from "bcryptjs";

function getRounds() {
  const raw = process.env.BCRYPT_ROUNDS;
  const rounds = raw ? Number(raw) : 12;
  if (!Number.isFinite(rounds) || rounds < 10 || rounds > 15) return 12;
  return rounds;
}

export async function hashPassword(plain: string) {
  return await bcrypt.hash(plain, getRounds());
}

export async function verifyPassword(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

