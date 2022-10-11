import Image from "next/image";
import { motion } from "framer-motion";

export default function Chat(): JSX.Element {
  return (
    <div className="col-span-8 flex flex-col">
      <div className="flex flex-row border-b border-customBorderColor py-4">
        <div className="ml-6 inline-block h-9 w-9 relative">
          <Image
            layout="fill"
            src="/images/selfie1.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <p className="self-center text-bell pl-3 text-lg font-bold">Selena Gomez</p>
      </div>
      {/*Chat*/}
      <div className="flex flex-col">
        <div className="flex flex-row justify-end mt-5 mr-6">
          <div className="flex flex-col">
            <div className="flex flex-row justify-end">
              <span className="self-center text-xs text-bell self-center">10:52 AM</span>
              <p className="self-center text-sm text-bell font-semibold mr-4 ml-3">
                Selena Gómez
              </p>
            </div>
            <p className="text-justify rounded-l-3xl rounded-br-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium commodi, dolorem doloribus eos ex nihil quam similique
              unde vero! Aliquid ea libero minima optio sint sit suscipit,
              voluptatibus. Impedit, nostrum!
            </p>
          </div>

          <div className="mr-3 inline-block h-10 w-10 relative">
            <Image
              layout="fill"
              src="/images/selfie1.webp"
              className="rounded-full"
              alt="NoImage"
            />
          </div>
        </div>
        <div className="flex flex-row justify-start mt-8 ml-6">
          <div className="inline-block h-10 w-10 relative">
            <Image
              layout="fill"
              src="/images/selfie.webp"
              className="rounded-full"
              alt="NoImage"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <p className="text-sm text-bell font-semibold self-end mr-3 ml-4">
                Charles Machado
              </p>
              <span className="self-center text-xs text-bell">10:52 AM</span>
            </div>
            <p className="rounded-r-3xl rounded-bl-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium commodi, dolorem doloribus eos ex nihil quam similique
              unde vero! Aliquid ea libero minima optio sint sit suscipit,
              voluptatibus. Impedit, nostrum!
            </p>
          </div>
        </div>
        <div className="flex flex-row w-full px-16 mt-16 pt-6 border-customBorderColor">
          <motion.input
            type="text"
            name="name"
            className="rounded-2xl w-full pl-4 py-3 pr-2 bg-background2 border border-customBorderColor focus:outline-none text-bell"
            placeholder="Write something"
          />
        </div>
      </div>
    </div>
  );
}
