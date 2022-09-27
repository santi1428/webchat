import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faArrowsRotate,
  faImages,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function ProfilePhoto() {
  const router = useRouter();
  const fileInput = useRef(null);
  const [file, setFile] = useState(Object | null);
  const [fileError, setFileError] = useState(String);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const { data: session, status } = useSession();

  const validateFile = () => {
    const selectedFile = fileInput.current.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!selectedFile.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        setFileError("Selected file is not valid.");
      } else {
        const fileSize = selectedFile.size / 1024 / 1024;
        if (fileSize > 3) {
          setFileError("File size exceeds 3 MiB");
        } else {
          setFileError("");
        }
      }
    }
  };

  const uploadProfilePhoto = async (
    body
  ): Promise<[boolean, null | AxiosError]> => {
    try {
      const res = await axios.put("/api/profilephoto", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      return [true, null];
    } catch (error) {
      return [false, error as AxiosError];
    }
  };

  const reloadSession = () => {
    console.log("reloading session");
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const uploadToServer = async (event) => {
    if (!uploadingProfilePhoto) {
      const uploadingToast = toast.loading("Updating profile photo...", {
        position: "bottom-center",
      });
      setUploadingProfilePhoto(true);
      const body = new FormData();
      body.append("file", file);
      const [res, error] = await uploadProfilePhoto(body);
      console.log(res, error);
      if (res) {
        reloadSession();
        setFile(null);
        toast.success("Your profile photo has been updated.", {
          position: "bottom-center",
          id: uploadingToast,
        });
      } else {
        toast.error("An error occurred. Please try again later.", {
          position: "bottom-center",
          id: uploadingToast,
        });
      }
      setUploadingProfilePhoto(false);
    }
  };

  console.log(
    "latest profile photo name session",
    session?.user?.profilePhotoName
  );

  return (
    <>
      <Head>
        <title>Change your profile photo.</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-77px)] text-base">
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <input
            type="file"
            id="file"
            ref={fileInput}
            className="hidden"
            onChange={validateFile}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={file?.name}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{ duration: 0.3 }}
              exit={{ scale: 0 }}
              className="h-64 w-64 relative "
            >
              <Image
                alt="NoImage"
                src={
                  file && fileError === ""
                    ? URL.createObjectURL(file)
                    : `/images/${session?.user?.profilePhotoName}`
                }
                layout="fill"
                objectFit="cover"
                className="rounded-full self-center cursor-pointer"
                onClick={() => {
                  fileInput.current.click();
                }}
              />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {fileError && (
              <motion.p
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center text-red-600 font-semibold text-sm mt-4"
                exit={{ scale: 0 }}
              >
                {fileError}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {file && fileError === "" ? (
                <motion.button
                  key={"button1"}
                  className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-64"
                  initial={{ opacity: 0, scale: 0.0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={uploadToServer}
                >
                  <FontAwesomeIcon
                    icon={faRotate}
                    className={uploadingProfilePhoto ? "fa-spin" : ""}
                  />
                  <span className="ml-2">
                    {uploadingProfilePhoto
                      ? "Updating Profile Photo..."
                      : "Update Profile Photo"}
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  key={"button2"}
                  className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-64"
                  initial={{ opacity: 0, scale: 0.0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    fileInput.current.click();
                  }}
                >
                  <FontAwesomeIcon icon={faImages} />
                  <span className="ml-2">Select Profile Photo</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-6">
            <motion.button
              className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-64"
              whileHover={{ scale: 1.05 }}
              onClick={async () => {
                await router.push("/");
              }}
            >
              <FontAwesomeIcon icon={faHouse} />
              <span className="ml-2">Go to Home Page</span>
            </motion.button>
          </div>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions as any
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
