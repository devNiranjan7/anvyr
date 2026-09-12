"use client";

import { assets } from "@/assets/assets.js";
import Message from "@/components/Message.jsx";
import PromptBox from "@/components/PromptBox.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [expand, setExpand] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [refreshChats, setRefreshChats] = useState(0);

    useEffect(() => {
        if (!chatId) {
            return;
        }
        const fetchChat = async () => {
            try {
                const response = await fetch(`/api/chat/get?chatId=${chatId}`);
                const data = await response.json();
                if (!response.ok) {
                    if (response.status === 404) {
                        localStorage.removeItem("anvyr-chat-id");
                        setChatId(null);
                        setMessages([]);
                        return;
                    }
                    throw new Error(data.error || "Failed to fetch chat");
                }
                setMessages(data.data.messages || []);
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };
        fetchChat();
    }, [chatId]);
    useEffect(() => {
        if (chatId) {
            localStorage.setItem("anvyr-chat-id", chatId);
        }
    }, [chatId]);
    useEffect(() => {
        const savedChatId = localStorage.getItem("anvyr-chat-id");
        if (savedChatId) {
            setChatId(savedChatId);
        }
    }, []);

    const handleNewChat = async () => {
        try {
            const response = await fetch("/api/chat/create", {
                method: "POST",
            });
            const data = await response.json();
            if (!response.ok || !data.chatId) {
                throw new Error(data.message || "Failed to create chat");
            }
            setChatId(data.chatId);
            setMessages([]);
            setRefreshChats((prev) => prev + 1);
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
    };

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar
                    expand={expand}
                    setExpand={setExpand}
                    setChatId={setChatId}
                    refreshChats={refreshChats}
                    onChatsChanged={() => setRefreshChats((prev) => prev + 1)}
                    handleNewChat={handleNewChat}
                />
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
                        <div className="w-full max-w-3xl overflow-y-auto">
                            {messages.map((message, index) => (
                                <Message
                                    key={index}
                                    role={message.role}
                                    content={message.content}
                                />
                            ))}
                        </div>
                    )}
                    <PromptBox
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        chatId={chatId}
                        setMessages={setMessages}
                        setRefreshChats={setRefreshChats}
                    />
                    <p className="text-xs absolute bottom-1 text-gray-500">
                        AI-generated, for reference only
                    </p>
                </div>
            </div>
        </div>
    );
}
