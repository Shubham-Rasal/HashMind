import { twMerge } from "tailwind-merge";
import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";

const Satoshi = localFont({
    src: [{ path: "../../fonts/Satoshi-Bold.woff2" }],
    display: "swap",
});

const Instrument = localFont({
    src: [{ path: "../../fonts/InstrumentSerif-Italic.ttf" }],
    display: "swap",
});

export default function Process() {
    const steps = [
        {
            icon: "🔍",
            title: "Explore Agents",
            description: "Browse our marketplace of specialized AI agents for any task or domain you can imagine."
        },
        {
            icon: "💬",
            title: "Engage or Create",
            description: (
                <>
                    Interact with existing agents or create your own using{' '}
                    <Link href="https://xmtp.org" target="_blank" rel="noopener noreferrer" className=" text-orange-500 hover:text-green-600 underline">
                        XMTP's
                    </Link> Chat interface
                    .
                </>
            )
        },
        {
            icon: "🚀",
            title: "Innovate & Grow",
            description: "Use AI to tackle any challenge, share your agents, and contribute to a world of endless possibilities."
        }
    ];

    return (
        <div className={twMerge(
            Satoshi.className,
            "text-white flex mt-10 mb-12 justify-center p-4"
        )}>
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block bg-gray-800 rounded-full px-4 py-2 mb-6">
                    <span className="text-sm font-medium">How It Works</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">
                    Our simple 3-step process to<br />
                    <span className={twMerge(
                        Instrument.className,
                        "text-green-700"
                    )}>revolutionize</span> agentic workflows.
                </h1>
                <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
                    From research to complex problem-solving, our AI agents provide expert assistance for any task imaginable.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="mb-4 text-5xl">{step.icon}</div>
                            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                            <p className="text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

