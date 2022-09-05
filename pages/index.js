import Head from "next/head";
import Image from "next/image";
import {
  faBell,
  faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="description" content="This is a free open source chat" />
        <link rel="icon" href="/favicon.ico" />
        <title>Free open source Chat - Home</title>
      </Head>
      <div className="w-100 bg-background h-screen w-screen">
        <div className="flex flex-row justify-between pt-4 pb-4 border-b border-bell ">
          <div className="ml-5 flex flex-row">
            <img src="/images/icons8-chat-48.png" alt="Logo" />
            <h3 className='self-center text-2xl ml-3 text-bell'>Open source chat</h3>
          </div>
          <div className="user-login-section flex flex-row mr-5">
            <a href="/" className="button self-center text-bell mr-1">
              <FontAwesomeIcon icon={faBell} size='lg' />
            </a>
            <div className="ml-5 mr-3 inline-block h-10 w-10 relative">
              <Image
                  layout='fill'
                  src="/images/selfie.webp"
                  className='rounded-full'
              />
            </div>
            <div className='flex flex-col'>
              <p className='text-bell font-semibold'>Charles Machado</p>
              <p className='text-xs text-bell'>charlesmachado@gmail.com</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2'>
          {/*left side */}
          <div className='flex flex-col border-r border-bell '>
            <input type="text" className='ml-7 rounded-2xl w-96 mt-6 pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell' placeholder="Search"/>
            <h3 className="ml-7 mt-6 text-bell text-lg font-semibold">Active now</h3>
            <div className='grid grid-cols-5 justify-items-center mt-5 pl-0 pb-5 border-b border-bell'>
              <div className="inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie1.webp"
                    className='rounded-full'
                />
              </div>
              <div className="mr-3 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie2.jpeg"
                    className='rounded-full'
                />
              </div>
              <div className="mr-3 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie3.jpg"
                    className='rounded-full'
                />
              </div>
              <div className="mr-3 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie4.webp"
                    className='rounded-full'
                />
              </div>
              <div className="mr-3 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie.webp"
                    className='rounded-full'
                />
              </div>
            </div>

            {/*Seccion de lista de chats*/}

            <div className="flex flex-row w-full border-b border-bell py-5">
              <div className="ml-7 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie4.webp"
                    className='rounded-full'
                />
              </div>
              <div className='flex flex-col w-full'>
                <div className="flex flex-row justify-between pb-1">
                  <p className='ml-5 text-bell font-semibold'>
                    Alison Parker
                  </p>
                  <div className='flex flex-row'>
                    <p className='text-bell mr-4'>12:30</p>
                    <a href="">
                      <FontAwesomeIcon icon={faEllipsisVertical} size='lg' className='pr-6 text-bell' />
                    </a>
                  </div>
                </div>
                <p className='ml-5 text-bell'>
                  OMG! This is amazing :).
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full border-b border-bell py-5">
              <div className="ml-7 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie1.webp"
                    className='rounded-full'
                />
              </div>
              <div className='flex flex-col w-full'>
                <div className="flex flex-row justify-between pb-1">
                  <p className='ml-5 text-bell font-semibold'>
                   Selena Gomez
                  </p>
                  <div className='flex flex-row'>
                    <p className='text-bell mr-4'>12:30</p>
                    <a href="">
                      <FontAwesomeIcon icon={faEllipsisVertical} size='lg' className='pr-6 text-bell' />
                    </a>
                  </div>
                </div>
                <p className='ml-5 text-bell'>
                  OMG! This is amazing :).
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full py-5 border-b border-bell py-5">
              <div className="ml-7 inline-block h-12 w-12 relative">
                <Image
                    layout='fill'
                    src="/images/selfie3.jpg"
                    className='rounded-full'
                />
              </div>
              <div className='flex flex-col w-full'>
                <div className="flex flex-row justify-between pb-1">
                  <p className='ml-5 text-bell font-semibold'>
                    Jack Harlow
                  </p>
                  <div className='flex flex-row'>
                    <p className='text-bell mr-4'>12:30</p>
                    <a href="">
                      <FontAwesomeIcon icon={faEllipsisVertical} size='lg' className='pr-6 text-bell' />
                    </a>
                  </div>
                </div>
                <p className='ml-5 text-bell'>
                  OMG! This is amazing :).
                </p>
              </div>
            </div>
          </div>
          {/*right side*/}
          <div className='flex flex-col'>
            <div className='flex flex-row border-b border-bell py-4'>
              <div className="ml-6 inline-block h-10 w-10 relative">
                <Image
                    layout='fill'
                    src="/images/selfie1.webp"
                    className='rounded-full'
                />
              </div>
              <p className='self-center text-bell pl-3 text-xl'>
                Selena Gomez
              </p>
            </div>
            {/*Chat*/}
            <div className='flex flex-col'>
             <div className="flex flex-row justify-end mt-5 mr-6">
               <div className='flex flex-col'>
                 <div className='flex flex-row justify-end'>
                   <small className='py-0 text-xs text-bell'>
                     10:52 AM
                   </small>
                   <p className='text-sm text-bell font-semibold mr-4 ml-3'>
                     Selena Gómez
                   </p>
                 </div>
                 <p className='text-justify rounded-l-3xl rounded-br-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium commodi, dolorem doloribus eos ex nihil quam similique unde vero! Aliquid ea libero minima optio sint sit suscipit, voluptatibus. Impedit, nostrum!</p>
               </div>

               <div className="mr-3 inline-block h-10 w-10 relative">
                 <Image
                     layout='fill'
                     src="/images/selfie1.webp"
                     className='rounded-full'
                 />
               </div>
             </div>
              <div className="flex flex-row justify-start mt-8 ml-6">
                <div className="inline-block h-10 w-10 relative">
                  <Image
                      layout='fill'
                      src="/images/selfie.webp"
                      className='rounded-full'
                  />
                </div>

                <div className='flex flex-col'>
                  <div className='flex flex-row'>
                    <p className='py-0 text-sm text-bell font-semibold self-end mr-3 ml-4'>
                      Charles Machado
                    </p>
                    <small className='py-0 text-xs text-bell'>
                      10:52 AM
                    </small>
                  </div>
                  <p className='rounded-r-3xl rounded-bl-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium commodi, dolorem doloribus eos ex nihil quam similique unde vero! Aliquid ea libero minima optio sint sit suscipit, voluptatibus. Impedit, nostrum!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
