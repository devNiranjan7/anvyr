import connectDB from "@/config/db.js";
import Chat from "@/models/Chat.js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server.js";

export async function GET(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }
        await connectDB();
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");
        if (chatId) {
            const chat = await Chat.findOne({ _id: chatId, userId });
            if (!chat) {
                return NextResponse.json(
                    { error: "Chat not found" },
                    { status: 404 },
                );
            }
            return NextResponse.json({ success: true, data: chat });
        }
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        return NextResponse.json({ success: true, data: chats });
    } catch (error) {
        console.error("Error fetching chats:", error);

        return NextResponse.json(
            { error: "Failed to fetch chats" },
            { status: 500 },
        );
    }
}
