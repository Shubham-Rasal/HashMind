import Link from 'next/link';

import { twMerge } from "tailwind-merge";
import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const Satoshi = localFont({
  src: [{ path: "../../fonts/Satoshi-Bold.woff2" }],
  display: "swap",
});

const Instrument = localFont({
  src: [{ path: "../../fonts/InstrumentSerif-Italic.ttf" }],
  display: "swap",
});



export default function Navbar() {
  return (
    <nav className={twMerge(
      Satoshi.className,
      "bg-white/70 backdrop-blur-md dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600",

    )}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">#<span className={twMerge(
            Instrument.className,
            "text-green-700 dark:text-green-400",

          )}>Mind</span></span>
        </Link>
        <div className="flex md:order-2">

          <Link
            href="/dashboard"
            className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-green-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
          >
            <span className="relative text-base font-semibold text-white"
            >Get Started</span>
          </Link>


          {/* <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Get started</button> */}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
            </li>
            <li>
              <Link href="/dashboard" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Marketplace</Link>
            </li>
            <li>
              <Link href="https://converse.xyz/dm/hashmind.converse.xyz" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 md:dark:hover:text-green-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Create Agent</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}