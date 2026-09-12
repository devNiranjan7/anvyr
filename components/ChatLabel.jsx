"use client";

import { assets } from "@/assets/assets.js";
import Image from "next/image.js";

const ChatLabel = ({ chat, openMenu, setOpenMenu, setChatId, refreshChats }) => {
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
            console.error("Error renaming chat:", error);
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
            setOpenMenu({ id: null, open: false });
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div
            onClick={() => setChatId(chat._id)}
            className="flex items-center justify-between p-2
text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
        >
            <p className="group-hover:max-w-5/6 truncate">{chat.name}</p>
            <div className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg">
                <button
                    type="button"
                    aria-label={`Open menu for ${chat.name}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenu((current) => ({
                            id: chat._id,
                            open: !(current.open && current.id === chat._id),
                        }));
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-black/80"
                >
                    <Image
                        src={assets.three_dots}
                        alt=""
                        className={`w-4 ${openMenu.open && openMenu.id === chat._id ? "block" : "hidden group-hover:block"}`}
                    />
                </button>
                <div
                    className={`absolute z-10 ${openMenu.open && openMenu.id === chat._id ? "" : "hidden"} right-0 top-6 bg-gray-700 rounded-xl w-max p-2 shadow-xl`}
                >
                    <button type="button" onClick={(event) => { event.stopPropagation(); handleRename(); }} className="flex w-full items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image
                            src={assets.pencil_icon}
                            alt="pencil"
                            className="w-4"
                        />
                        <p>Rename</p>
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); handleDelete(); }} className="flex w-full items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image
                            src={assets.delete_icon}
                            alt="delete"
                            className="w-4"
                        />
                        <p>Delete</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatLabel;
