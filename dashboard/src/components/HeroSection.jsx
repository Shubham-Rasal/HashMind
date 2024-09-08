import Link from "next/link"
import Image from "next/image"
import { twMerge } from "tailwind-merge";
import localFont from "next/font/local";
import Process from "./Process";

// Font files can be colocated inside of `app`
const Satoshi = localFont({
    src: [{ path: "../../fonts/Satoshi-Bold.woff2" }],
    display: "swap",
});

const Instrument = localFont({
    src: [{ path: "../../fonts/InstrumentSerif-Italic.ttf" }],
    display: "swap",
});

export default function Hero() {
    return (
        <section className="relative dark:bg-gray-900" id="home">
            <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
                <div className="blur-[106px] h-56 bg-gradient-to-br from-green-700 to-green-900 dark:from-green-800 transform transition-all duration-500 ease-in-out hover:scale-105 hover:rotate-3 relative" style={{ opacity: 1, transform: 'perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg) skewX(-5deg) skewY(0deg) translateZ(0px)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white opacity-30 m-2"></div>
                            <div className="h-2 w-2 rounded-full bg-white opacity-30 m-2"></div>
                            <div className="h-2 w-2 rounded-full bg-white opacity-30 m-2"></div>
                        </div>
                    </div>
                </div>
                <div className="blur-[106px] h-32 bg-gradient-to-r from-green-600 to-green-800 dark:to-green-700 transform transition-all duration-500 ease-in-out hover:scale-105 hover:-rotate-3 relative" style={{ opacity: 1, transform: 'perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg) skewX(5deg) skewY(0deg) translateZ(0px)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white opacity-30 m-2"></div>
                            <div className="h-2 w-2 rounded-full bg-white opacity-30 m-2"></div>
                            <div className="h-2 w-2 rounded-full bg-white opacity-30 m-2"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
                <div className="relative pt-36 ml-auto">
                    <div className={twMerge(
                        Satoshi.className,
                        "font-normal text-white lg:w-2/3 text-center mx-auto",
                        
                    )}>


                        <h1 className="text-gray-900 dark:text-white font-bold text-4xl md:text-6xl xl:text-7xl">Decentralized <span 
                        
                        className={twMerge(
                            Instrument.className,
                            "text-green-700 dark:text-green-400 italic",
                            
                        )}

                        >AI Agent Marketplace</span></h1>
                        <h2 className="text-gray-700 dark:text-gray-300 font-semibold text-2xl md:text-3xl xl:text-4xl mt-4">Crowd-Sourced Experts at Your Fingertips</h2>
                        <p className="mt-8 text-gray-700 dark:text-gray-300">
                            Why rely on a single AI when you can have an army of specialized agents? Discover, create, and leverage AI agents for all things.
                        </p>
                        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                            <Link
                                href="/dashboard"
                                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-green-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                            >
                                <span className="relative text-base font-semibold text-white"
                                >Explore Marketplace</span>
                            </Link>
                            <Link
                                href="https://converse.xyz/dm/hashmind.converse.xyz"
                                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-green-700/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                            >
                                <span
                                    className="relative text-base font-semibold text-green-700 dark:text-green-400"
                                >Create Agent</span
                                >
                            </Link>



                        </div>
                    </div>
                            <div className="mt-12 w-full">
                                <Image
                                    src="/hero_chat.png"
                                    alt="Product Screenshot"
                                    width={1920}
                                    height={1080}
                                    className="w-full h-auto rounded-xl shadow-xl shadow-green-100 shadow-opacity-20 border-2 border-green-700 border-opacity-15"
                                />
                            </div>
                        <Process />

                </div>
            </div>
        </section>
    )
}