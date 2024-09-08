import { twMerge } from "tailwind-merge";
import localFont from "next/font/local";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const Satoshi = localFont({
  src: [{ path: "../../fonts/Satoshi-Bold.woff2" }],
  display: "swap",
});

const Instrument = localFont({
  src: [{ path: "../../fonts/InstrumentSerif-Italic.ttf" }],
  display: "swap",
});

export default function Features() {
  const technologies = [
    {
      icon: "/galadriel.png",
      title: "Galadriel",
      description: "Galadriel is a Layer 1 blockchain specifically designed for AI applications, allowing developers to build decentralized AI solutions using familiar Solidity smart contracts, effectively bridging the gap between blockchain and artificial intelligence.",
      url: "https://galadriel.com/"
    },
    {
      icon: "/xmtp.png",
      title: "XMTP",
      description: "Our platform leverages XMTP for secure, decentralized messaging, enabling us to process agent creation prompts and interact with smart contracts to deploy and manage AI agents on the blockchain, ensuring privacy and reliability throughout the process.",
      url: "https://xmtp.org/"
    },
    {
      icon: "/web3auth.png",
      title: "Web3Auth",
      description: "Web3Auth integration provides a seamless onboarding experience, allowing users to authenticate using familiar Web2 providers while securely connecting to blockchain wallets. This approach significantly reduces entry barriers for new users while maintaining the security benefits of Web3 technology.",
      url: "https://web3auth.io/"
    },
    {
      icon: "/hedera.png",
      title: "Hedera",
      description: "Hedera enables secure and efficient internal dialogue for AI agents through its distributed consensus service, allowing for rapid and reliable decision-making in decentralized environments.",
      url: "https://hedera.com/"
    },
    {
      icon: "/lit.png",
      title: "Lit Protocol",
      description: "Lit Protocol offers decentralized encryption and access control mechanisms, ensuring robust protection for user privacy and sensitive data in blockchain-based applications, enhancing overall security and trust.",
      url: "https://litprotocol.com/"
    }
  ];

  return (
    <div className={twMerge(
      Satoshi.className,
      "min-h-screen text-black flex items-center justify-center p-4 relative overflow-hidden"
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-200 via-white to-white"></div>
      <div className="relative z-10 max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
        <div className="inline-block bg-gray-800 rounded-full px-4 py-2 mb-6">
                    <span className="text-sm font-medium text-white">POWERED BY ADVANCED TECHNOLOGIES</span>
                </div>

          {/* <div className="inline-flex items-center bg-white/10 rounded-full px-3 py-1 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            POWERED BY ADVANCED TECHNOLOGIES
          </div> */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Our <span className={Instrument.className}>Technology</span> Stack
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform leverages cutting-edge technologies to provide a secure, efficient, and user-friendly experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <Link href={tech.url} key={index} target="_blank" rel="noopener noreferrer" className="flex">
              <div className="bg-black-900/50 border-2 border-black/10 rounded-xl hover:bg-white/10 transition-colors p-6 space-y-4 cursor-pointer flex flex-col h-full">
                <div className="flex justify-center flex-shrink-0">
                  <Image
                    src={tech.icon}
                    alt={tech.title}
                    width={64}
                    height={64}
                    className="rounded-full object-cover mb-4"
                  />
                </div>
                <h2 className="text-xl font-semibold text-center flex-shrink-0">{tech.title}</h2>
                <p className="text-sm text-gray-500 text-center flex-grow">{tech.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}