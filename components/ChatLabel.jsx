"use client";

import { assets } from "@/assets/assets.js";
import Image from "next/image.js";
import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

const ChatLabel = ({
    chat,
    openMenu,
    setOpenMenu,
    setChatId,
    refreshChats,
    onChatDeleted,
    isActive,
}) => {
    const [menuPosition, setMenuPosition] = useState(null);
    const isMenuOpen = openMenu.open && openMenu.id === chat._id;

    const handleRename = async () => {
        const newName = prompt("Enter new chat name:", chat.name);
        if (!newName || !newName.trim()) {
            return;
        }
        try {
            const response = await fetch("/api/chat/rename", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: chat._id,
                    name: newName.trim(),
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to rename chat");
            }
            refreshChats();
            setOpenMenu({ id: null, open: false });
        } catch (error) {
            toast.error("Error renaming chat:", error);
        }
    };
    const handleDelete = async () => {
        if (!confirm(`Delete \"${chat.name}\"?`)) {
            return;
        }
        try {
            const response = await fetch("/api/chat/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chatId: chat._id }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to delete chat");
            }
            refreshChats();
            onChatDeleted(chat._id);
            setOpenMenu({ id: null, open: false });
        } catch (error) {
            toast.error("Error deleting chat:", error);
        }
    };

    const menu = isMenuOpen && menuPosition && (
        <div
            className="fixed z-50 w-fit rounded-xl bg-gray-700 p-2 shadow-xl text-gray-200"
            style={menuPosition}
        >
            <button
                type="button"
                onClick={handleRename}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10"
            >
                <Image src={assets.pencil_icon} alt="pencil" className="w-4" />
                <p>Rename</p>
            </button>
            <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10"
            >
                <Image src={assets.delete_icon} alt="delete" className="w-4" />
                <p>Delete</p>
            </button>
        </div>
    );

    return (
        <>
            <div
                onClick={() => setChatId(chat._id)}
                className={`flex items-center justify-between p-2 rounded-lg text-sm group cursor-pointer ${
                    isActive
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10"
                }`}
            >
                <p className="group-hover:max-w-5/6 truncate">{chat.name}</p>
                <div className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg">
                    <button
                        type="button"
                        aria-label={`Open menu for ${chat.name}`}
                        onClick={(event) => {
                            event.stopPropagation();
                            const { left, right, top } =
                                event.currentTarget.getBoundingClientRect();
                            const menuWidth = 140;
                            const menuLeft =
                                right + 8 + menuWidth <= window.innerWidth
                                    ? right + 8
                                    : Math.max(8, left - menuWidth - 8);
                            setMenuPosition({
                                left: menuLeft,
                                top: Math.max(
                                    8,
                                    Math.min(top, window.innerHeight - 112),
                                ),
                            });
                            setOpenMenu((current) => ({
                                id: chat._id,
                                open: !(
                                    current.open && current.id === chat._id
                                ),
                            }));
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-black/80"
                    >
                        <Image
                            src={assets.three_dots}
                            alt=""
                            className={`w-4 ${isMenuOpen ? "block" : "hidden group-hover:block"}`}
                        />
                    </button>
                </div>
            </div>
            {typeof document !== "undefined" &&
                createPortal(menu, document.body)}
        </>
    );
};

export default ChatLabel;
