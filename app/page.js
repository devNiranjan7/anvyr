"use client";

import { assets } from "@/assets/assets.js";
import Message from "@/components/Message.jsx";
import PromptBox from "@/components/PromptBox.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [expand, setExpand] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [refreshChats, setRefreshChats] = useState(0);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!chatId) {
            return;
        }
        const controller = new AbortController();
        const fetchChat = async () => {
            try {
                const response = await fetch(`/api/chat/get?chatId=${chatId}`, {
                    signal: controller.signal,
                });
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
                if (error.name === "AbortError") {
                    return;
                }
                console.error("Error fetching chat:", error);
            }
        };
        fetchChat();
        return () => controller.abort();
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
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isLoading]);

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
    const handleChatDeleted = (deleteChatId) => {
        if (deleteChatId !== chatId) {
            return;
        }
        setChatId(null);
        setMessages([]);
        localStorage.removeItem("anvyr-chat-id");
        handleNewChat();
    };
    const handleRegenerate = async () => {
        if (!chatId || isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("/api/chat/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId,
                    regenerate: true,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to regenerate response");
            }
            setMessages((prev) => {
                const updated = [...prev];
                const lastAssistantIndex = updated
                    .map((message) => message.role)
                    .lastIndexOf("assistant");
                if (lastAssistantIndex !== -1) {
                    updated[lastAssistantIndex] = {
                        ...updated[lastAssistantIndex],
                        content: data.message,
                    };
                }
                return updated;
            });
            setRefreshChats((prev) => prev + 1);
        } catch (error) {
            console.error("Error regenerating response:", error);
        } finally {
            setIsLoading(false);
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
                    onChatDeleted={handleChatDeleted}
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
                                    isLastMessage={
                                        index === messages.length - 1 &&
                                        message.role === "assistant"
                                    }
                                    onRegenerate={handleRegenerate}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 px-4 py-3 text-white/60">
                                    <Image
                                        src={assets.logo_icon}
                                        alt="Anvyr"
                                        className="w-5 h-5"
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="animate-bounce">
                                            ●
                                        </span>
                                        <span className="animate-bounce [animation-delay:150ms]">
                                            ●
                                        </span>
                                        <span className="animate-bounce [animation-delay:150ms]">
                                            ●
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
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
