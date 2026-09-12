import { assets } from "@/assets/assets.js";
import { AppContext } from "@/context/AppContext.jsx";
import { useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image.js";
import { useContext, useEffect, useState } from "react";
import ChatLabel from "./ChatLabel.jsx";
import toast from "react-hot-toast";

const Sidebar = ({
    expand,
    setExpand,
    setChatId,
    refreshChats,
    onChatsChanged,
    handleNewChat,
    onChatDeleted,
    activeChatId,
}) => {
    const { openSignIn } = useClerk();
    const { user } = useContext(AppContext);
    const [openMenu, setOpenMenu] = useState({ id: 0, open: false });
    const [chats, setChats] = useState([]);
    const [showQrCode, setShowQrCode] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchChats = async () => {
            try {
                const response = await fetch("/api/chat/get");
                const data = await response.json();
                if (data.success) {
                    setChats(data.data);
                }
            } catch (error) {
                toast.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, [user, refreshChats]);

    return (
        <div
            className={`flex flex-col justify-between bg-[#212327] h-screen transition-all z-50 max-md:absolute max-md:h-screen ${expand ? "p-4 pt-7 w-64" : "pt-7 md:w-20 w-0 max-md:overflow-hidden"}`}
        >
            <div className="flex flex-col min-h-0 flex-1">
                <div
                    className={`flex ${expand ? "flex-row" : "flex-col items-center"} gap-8`}
                >
                    <Image
                        className={expand ? "w-28" : "w-8"}
                        src={expand ? assets.logo_text : assets.logo_icon}
                        alt="brand"
                    />
                    <div
                        onClick={() => setExpand(!expand)}
                        className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer"
                    >
                        <Image
                            src={assets.menu_icon}
                            alt="menu"
                            className="md:hidden"
                        />
                        <Image
                            src={
                                expand
                                    ? assets.sidebar_close_icon
                                    : assets.sidebar_icon
                            }
                            alt="sidebar"
                            className="hidden md:block w-7"
                        />
                        <div
                            className={`absolute w-max opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black text-white text-sm px-3 py-1.5 rounded-lg shadow-lg pointer-events-none ${expand ? "left-1/2 -translate-x-1/2 top-full mt-2" : "left-full ml-2 top-1/2 -translate-y-1/2"}`}
                        >
                            {expand ? "Close Sidebar" : "Open Sidebar"}
                            <div
                                className={`w-2 h-2 absolute bg-black rotate-45 ${expand ? "left-1/2 -translate-x-1/2 -top-1" : "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
                            ></div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleNewChat}
                    className={`group relative mt-8 flex items-center justify-center cursor-pointer ${expand ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" : "h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"}`}
                >
                    <Image
                        src={expand ? assets.chat_icon : assets.chat_icon_dull}
                        alt="chat"
                        className="w-7"
                    />
                    {!expand && (
                        <div className="absolute w-max left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black text-white text-sm px-3 py-1.5 rounded-lg shadow-lg pointer-events-none">
                            New Chat
                            <div className="w-2 h-2 absolute bg-black rotate-45 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    )}
                    {expand && (
                        <p className="text-white font-medium">New Chat</p>
                    )}
                </button>
                <div
                    className={`my-8 text-white/25 text-sm min-h-0 overflow-y-auto ${expand ? "block" : "hidden"}`}
                >
                    <p className="my-1">Recents</p>
                    {chats.map((chat) => (
                        <ChatLabel
                            key={chat._id}
                            chat={chat}
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                            setChatId={setChatId}
                            refreshChats={onChatsChanged}
                            onChatDeleted={onChatDeleted}
                            isActive={chat._id === activeChatId}
                        />
                    ))}
                </div>
            </div>
            <div>
                <button
                    type="button"
                    aria-label="Show website QR code"
                    aria-expanded={showQrCode}
                    onClick={() => setShowQrCode((isVisible) => !isVisible)}
                    className={`w-full flex items-center cursor-pointer group relative ${expand ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10 cursor-pointer" : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}
                >
                    <Image
                        src={
                            expand ? assets.phone_icon : assets.phone_icon_dull
                        }
                        alt=""
                        className={expand ? "w-5" : "w-6 mx-auto"}
                    />
                    <div
                        className={`absolute -top-60 pb-8 ${!expand && "-right-40"} opacity-0 group-hover:opacity-100 hidden group-hover:block transition ${showQrCode ? "max-md:opacity-100 max-md:block" : ""}`}
                    >
                        <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
                            <Image
                                src={assets.qrcode}
                                alt="qr"
                                className="w-44"
                            />
                            <p>Scan to use Anvyr</p>
                            <div
                                className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "right-1/2" : "left-4"} -bottom-1.5`}
                            ></div>
                        </div>
                    </div>
                    {expand && (
                        <>
                            <span>Get website</span>
                            <Image src={assets.new_icon} alt="new icon" />
                        </>
                    )}
                </button>
                <div
                    onClick={user ? null : openSignIn}
                    className={`flex items-center ${expand ? "hover:bg-white/10 rounded-lg" : "justify-center w-full"} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
                >
                    {user ? (
                        <UserButton />
                    ) : (
                        <Image
                            src={assets.profile_icon}
                            alt="profile"
                            className="w-7"
                        />
                    )}
                    {expand && <span>My Profile</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
