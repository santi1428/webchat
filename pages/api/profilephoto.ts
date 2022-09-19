import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import cuid from "cuid";
import { prisma } from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "../../utils/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getFileExtension = (filename: String) => {
  const ext = path.extname(filename);
  return ext;
};

const saveFile = async (file: File): Promise<String> => {
  const data = fs.readFileSync(file.filepath);
  const fileExt: String = getFileExtension(file.originalFilename);
  const generateRandomImageName: String = cuid();
  fs.writeFileSync(
    `./public/images/${generateRandomImageName}${fileExt}`,
    data
  );
  await fs.unlinkSync(file.filepath);
  return `${generateRandomImageName}${fileExt}`;
};

const removeFile = (filePath) => {
  fs.unlinkSync(filePath);
};

const updateUserProfilePhotoName = async (
  id: String,
  profilePhotoName: String
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      profilePhotoName,
    },
  });
};

const validateFile = (file: File): boolean => {
  if (file) {
    if (!file.originalFilename.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      console.log("Selected file is not valid.");
      return false;
    } else {
      console.log("Selected file is valid");
      return true;
    }
  }
  return false;
};

const uploadFile = (req: NextApiRequest, user: User) => {
  const defaultProfilePhotoName = "default-profile-photo.png";
  const form = new formidable.IncomingForm();
  return new Promise(function (resolve, reject) {
    form.parse(req, async function (err, fields, files) {
      const file: File = files.file;
      if (validateFile(file)) {
        try {
          const fullNewPhotoName = await saveFile(file);
          await updateUserProfilePhotoName(user.id, fullNewPhotoName);
          if (user.profilePhotoName !== defaultProfilePhotoName) {
            removeFile(`./public/images/${user.profilePhotoName}`);
          }
          resolve();
        } catch (err) {
          console.log(err);
          reject("There was an error uploading the file");
        }
      }
      reject("File is not valid");
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const user: User = session?.user;
      try {
        await uploadFile(req, user);
        return res.status(201).end();
      } catch (err) {
        console.log(err);
        return res.status(422).send(err);
      }
    } else {
      return res.status(401).send("User not authorized.");
    }
  }
}
