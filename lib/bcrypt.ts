import bcrypt from "bcrypt";

export default async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
}
