import { assets } from "@/assets/assets.js";
import Image from "next/image.js";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";

const Message = ({ role, content, onRegenerate, isLastMessage,onEdit }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-3xl text-sm">
            <div
                className={`flex flex-col w-full mb-8 ${role === "user" && "items-end"}`}
            >
                <div
                    className={`group relative flex max-w-2xl py-3 rounded-xl ${role === "user" ? "bg-[#414158] px-5" : "gap-3"}`}
                >
                    <div
                        className={`opacity-0 group-hover:opacity-100 absolute ${role === "user" ? "-left-16 top-2.5" : "left-9 -bottom-6"} transition-all`}
                    >
                        <div className="flex items-center gap-2 opacity-70">
                            {role === "user" ? (
                                <>
                                    <Image
                                        src={assets.copy_icon}
                                        alt="copy"
                                        className="w-4 cursor-pointer"
                                    />
                                    <Image
                                        onClick={() => onEdit(content)}
                                        src={assets.pencil_icon}
                                        alt="pencil"
                                        className="w-4.5 cursor-pointer"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="relative">
                                        <Image
                                            onClick={handleCopy}
                                            src={assets.copy_icon}
                                            alt="copy"
                                            className="w-4.5 cursor-pointer"
                                        />
                                        {copied && (
                                            <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-xs text-white bg-black px-2 py-1 rounded">
                                                Copied
                                            </span>
                                        )}
                                    </div>
                                    <Image
                                        onClick={
                                            isLastMessage
                                                ? onRegenerate
                                                : undefined
                                        }
                                        src={assets.regenerate_icon}
                                        alt="regenerate"
                                        className={`w-4.5 ${
                                            isLastMessage
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-40"
                                        }`}
                                    />
                                    <Image
                                        src={assets.like_icon}
                                        alt="like"
                                        className="w-4.5 cursor-pointer"
                                    />
                                    <Image
                                        src={assets.dislike_icon}
                                        alt="dislike"
                                        className="w-4.5 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    {role === "user" ? (
                        <span className="text-white/90">{content}</span>
                    ) : (
                        <>
                            <Image
                                src={assets.logo_icon}
                                alt="logo"
                                className="h-8 w-8 p-1 border border-white/15 rounded-full"
                            />
                            <div className="space-y-4 w-full overflow-hidden">
                                <Markdown
                                    components={{
                                        h1: ({ children }) => (
                                            <h1 className="text-2xl font-semibold mb-4">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children }) => (
                                            <h2 className="text-xl font-semibold mb-3">
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({ children }) => (
                                            <h3 className="text-lg font-semibold mb-2">
                                                {children}
                                            </h3>
                                        ),
                                        p: ({ children }) => (
                                            <p className="leading-7 mb-3">
                                                {children}
                                            </p>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="list-disc ml-6 mb-3 space-y-1">
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="list-decimal ml-6 mb-3 space-y-1">
                                                {children}
                                            </ol>
                                        ),
                                        li: ({ children }) => (
                                            <li className="leading-7">
                                                {children}
                                            </li>
                                        ),
                                        a: ({ children, href }) => (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline"
                                            >
                                                {children}
                                            </a>
                                        ),
                                        code: ({ children, className }) => {
                                            const isBlock =
                                                className?.includes(
                                                    "language-",
                                                );

                                            return isBlock ? (
                                                <code
                                                    className={`${className} block`}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <code className="px-1.5 py-0.5 rounded bg-white/10 text-sm">
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {content}
                                </Markdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
