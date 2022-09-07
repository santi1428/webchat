import validationScheme from "../../utils/validation-scheme";
import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from '../../lib/bcrypt';

type User = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhotoName: string;
};

const validateFields = async (
  newUser: User
): Promise<[boolean, null | { errors: string[] }]> => {
  try {
    await validationScheme.validate(newUser);
    return [true, null];
  } catch (errors: any) {
    console.log(errors.message);
    return [false, errors];
  }
};

const doesEmailExist = async (email: string) : Promise<boolean> => {
  const userCount : number = await prisma.user.count({
    where: {
      email
    }
  })
  return userCount > 0;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    let newUser: User = {...req.body, profilePhotoName: 'default-profile-photo'};
    const fieldsValidation = await validateFields(newUser);
    if (fieldsValidation[0]) {
      try {
        const emailExists : boolean = await doesEmailExist(newUser.email);
        if (emailExists){
          return res.status(400).json(["Email already exists."]);
        }
        const hashedPassword = await bcrypt(newUser.password);
        await prisma.user.create({
          data: {
            name: newUser.name,
            lastName: newUser.lastName,
            email: newUser.email,
            password: hashedPassword,
            profilePhotoName: newUser.profilePhotoName,
          },
        });
        res.status(200).end();
      } catch (err) {
        console.log(err);
        return res.status(500).end();
      }
    } else {
      return res.status(400).json(fieldsValidation[1].errors);
    }
  }
}
