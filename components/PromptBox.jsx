import { assets } from "@/assets/assets.js";
import Image from "next/image.js";
import { useState } from "react";

const PromptBox = ({
    isLoading,
    setIsLoading,
    chatId,
    setMessages,
    setRefreshChats,
}) => {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading || !chatId) {
            return;
        }
        const userMessage = prompt.trim();
        setPrompt("");
        setIsLoading(true);
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);
        try {
            const response = await fetch("/api/chat/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId,
                    message: userMessage,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to get AI response");
            }
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.message },
            ]);
            setRefreshChats((prev) => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
        >
            <textarea
                rows={2}
                placeholder="Message Anvyr"
                required
                className="outline-none w-full resize-none overflow-hidden wrap-break-word bg-transparent"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
            />
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image
                            src={assets.deepthink_icon}
                            alt="think"
                            className="h-5"
                        />
                        DeepThink (L1)
                    </p>
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image
                            src={assets.search_icon}
                            alt="think"
                            className="h-5"
                        />
                        Search
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Image
                        src={assets.pin_icon}
                        alt=""
                        className="w-4 cursor-pointer"
                    />
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isLoading || !chatId}
                        className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointe disabled:cursor-not-allowed`}
                    >
                        <Image
                            src={
                                prompt
                                    ? assets.arrow_icon
                                    : assets.arrow_icon_dull
                            }
                            alt=""
                            className="w-4 cursor-pointer"
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PromptBox;
