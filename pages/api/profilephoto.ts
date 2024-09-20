import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import cuid from "cuid";
import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from 'cloudinary-build-url'


// Configuration
cloudinary.config({
  cloud_name: "dgtwlcw1i",
  api_key: "483983667889134",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const getFileExtension = (filename: string) => {
  const ext = path.extname(filename);
  return ext;
};

const saveFile = async (file): Promise<string> => {
  const generateRandomImageName: string = cuid();
  const uploadResult = await cloudinary.uploader.upload(file.filepath, {
    public_id: `${generateRandomImageName}`,
  });
  return uploadResult.secure_url;
};

const removeFile = async (url: string) => {
  const publicId : string = extractPublicId(url);
  await cloudinary.uploader.destroy(publicId);
};

const updateUserProfilePhotoURLByID = async (
  id: string,
  profilePhotoURL: string
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      profilePhotoURL,
    },
  });
};

const validateFile = (file): boolean => {
  if (file) {
    if (!file.originalFilename.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      console.log("Selected file is not valid.");
      return false;
    } else {
      console.log("Selected file is valid");
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 3) {
        console.log("File size exceeds 3 MiB");
        return false;
      }
      return true;
    }
  }
  return false;
};

const uploadFile = (
  req: NextApiRequest,
  user: User
): Promise<void | string> => {
  const defaultProfilePhotoURL = "https://res.cloudinary.com/dgtwlcw1i/image/upload/v1726787525/vnj59rodfbromdnwomuv.png";
  const form = new formidable.IncomingForm();
  return new Promise(function (resolve, reject) {
    form.parse(req, async function (err, fields, files) {
      const file: File = files.file;
      if (validateFile(file)) {
        try {
          const fullNewPhotoURL = await saveFile(file);
          await updateUserProfilePhotoURLByID(user.id, fullNewPhotoURL);
          if (user.profilePhotoURL !== defaultProfilePhotoURL) {
            removeFile(user.profilePhotoURL);
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
  if (req.method == "PUT") {
    const session = await getServerSession(req, res, authOptions);
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
      return res.status(401).send("ListUser not authorized.");
    }
  }
}
