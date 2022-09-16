import bcrypt from 'bcrypt';

 async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password: string | number, hash: string) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

export {
   hashPassword,
    comparePassword
}
