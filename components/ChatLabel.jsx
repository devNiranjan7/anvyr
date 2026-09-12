"use client";

import { assets } from "@/assets/assets.js";
import Image from "next/image.js";

const ChatLabel = ({ chat, openMenu, setOpenMenu, setChatId }) => {
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
        } catch (error) {
            console.error("Error renaming chat:", error);
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
                <Image
                    src={assets.three_dots}
                    alt="dots"
                    className={`w-4 ${openMenu.open ? "" : "hidden"} group-hover:block`}
                />
                <div
                    className={`absolute ${openMenu.open ? "" : "hidden"} -right-36 top-6 bg-gray-700 rounded-xl w-max p-2`}
                >
                    <div onClick={handleRename} className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image
                            src={assets.pencil_icon}
                            alt="pencil"
                            className="w-4"
                        />
                        <p>Rename</p>
                    </div>
                    <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
                        <Image
                            src={assets.delete_icon}
                            alt="delete"
                            className="w-4"
                        />
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatLabel;
