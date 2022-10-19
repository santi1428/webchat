import Image from "next/image";

export default function Messages(): JSX {


  return (
    <>
      <div className="flex flex-row justify-end mt-6 mr-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-end">
            <span className="self-center text-xs text-bell self-center">
              9:52 AM
            </span>
            <p className="self-center text-sm text-bell font-semibold mr-5 ml-3">
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

        <div className="mr-4 inline-block h-10 w-10 relative">
          <Image
            layout="fill"
            src="/images/selfie1.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
      </div>
      <div className="flex flex-row justify-start mt-9 ml-6">
        <div className="inline-block h-11 w-10 relative">
          <Image
            layout="fill"
            src="/images/selfie.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row">
            <p className="text-sm text-bell font-semibold self-end mr-4 ml-4">
              Charles Machado
            </p>
            <span className="self-center text-xs text-bell">9:52 AM</span>
          </div>
          <p className="rounded-r-3xl rounded-bl-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Accusantium commodi, dolorem doloribus eos ex nihil quam similique
            unde vero! Aliquid ea libero minima optio sint sit suscipit,
            voluptatibus. Impedit, nostrum!
          </p>
        </div>
      </div>
    </>
  );
}
