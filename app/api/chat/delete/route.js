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
        const { chatId } = await req.json();
        await connectDB();
        await Chat.deleteOne({ _id: chatId, userId });
        return NextResponse.json({ success: true, message: "Chat Deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
