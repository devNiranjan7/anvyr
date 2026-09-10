"use client";

import { assets } from "@/assets/assets.js";
import Message from "@/components/Message.jsx";
import PromptBox from "@/components/PromptBox.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
    const [expand, setExpand] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar expand={expand} setExpand={setExpand} />
                <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
                    <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
                        <Image
                            onClick={() => setExpand(!expand)}
                            className="rotate-180"
                            src={assets.menu_icon}
                            alt="menu"
                        />
                        <Image
                            className="opacity-70"
                            src={assets.chat_icon}
                            alt="chat"
                        />
                    </div>
                    {messages.length === 0 ? (
                        <>
                            <div className="flex items-center gap-3">
                                <Image
                                    src={assets.logo_icon}
                                    alt="logo"
                                    className="h-8 w-8"
                                />
                                <p className="text-2xl font-medium">
                                    Hi, I&apos;m Anvyr.
                                </p>
                            </div>
                            <p className="text-sm mt-2">
                                How can I help you today?
                            </p>
                        </>
                    ) : (
                        <div>
                            <Message role="user" content="What is Next.js" />
                        </div>
                    )}
                    <PromptBox
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                    <p className="text-xs absolute bottom-1 text-gray-500">
                        AI-generated, for reference only
                    </p>
                </div>
            </div>
        </div>
    );
}
