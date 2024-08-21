import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password: string | number, hash: string) {
  let p : string = typeof password === "string" ? password : password.toString();
  const match = await bcrypt.compare(p, hash);
  return match;
}

export { hashPassword, comparePassword };
