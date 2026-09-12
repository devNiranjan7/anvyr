import connectDB from "@/config/db.js";
import Chat from "@/models/Chat.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server.js";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated",
            });
        }
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
        };
        await connectDB();
        const chat = await Chat.create(chatData);
        return NextResponse.json({
            success: true,
            message: "Chat Created",
            chatId: chat._id,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
