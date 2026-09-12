import { assets } from "@/assets/assets.js";
import Image from "next/image.js";
import { useEffect, useState } from "react";

const PromptBox = ({
    isLoading,
    setIsLoading,
    chatId,
    setMessages,
    setRefreshChats,
    editingMessage,
    setEditingMessage,
    onEditSubmit,
    onEditComplete,
}) => {
    const [prompt, setPrompt] = useState(editingMessage || "");

    useEffect(() => {
        if (editingMessage !== null) {
            setPrompt(editingMessage);
        }
    }, [editingMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingMessage !== null) {
            onEditSubmit(prompt.trim());
            setPrompt("");
            onEditComplete();
            return;
        }
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
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && prompt.trim() && chatId) {
                e.currentTarget.form?.requestSubmit();
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full shrink-0 ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
        >
            <textarea onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Message Anvyr"
                required
                className="outline-none w-full resize-none overflow-hidden wrap-break-word bg-transparent max-h-40 overflow-y-auto"
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
                        Gemini (Flash)
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
