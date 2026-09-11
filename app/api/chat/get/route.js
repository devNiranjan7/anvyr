import connectDB from "@/config/db.js";
import Chat from "@/models/Chat.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server.js";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated",
            });
        }
        await connectDB();
        const data = await Chat.find({ userId });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
