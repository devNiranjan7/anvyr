import connectDB from "@/config/db.js";
import Chat from "@/models/Chat.js";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }
        const { chatId, message, regenerate, editIndex } = await req.json();
        if (
            !chatId ||
            (!message && !regenerate) ||
            (editIndex !== undefined && !message)
        ) {
            return NextResponse.json(
                { error: "Chat ID and message are required" },
                { status: 400 },
            );
        }
        await connectDB();
        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return NextResponse.json(
                { error: "Chat not found" },
                { status: 404 },
            );
        }
        if (editIndex !== undefined) {
            const editedMessage = message.trim();
            const messagesToKeep = chat.messages.slice(0, editIndex);
            const messages = [
                ...messagesToKeep.map((msg) => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content }],
                })),
                {
                    role: "user",
                    parts: [{ text: editedMessage }],
                },
            ];
            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: messages,
            });
            const aiMessage = response.text;
            const updatedMessages = [
                ...messagesToKeep,
                {
                    role: "user",
                    content: editedMessage,
                    timestamp: Date.now(),
                },
                {
                    role: "assistant",
                    content: aiMessage,
                    timestamp: Date.now(),
                },
            ];
            await Chat.updateOne(
                { _id: chatId, userId },
                {
                    $set: {
                        messages: updatedMessages,
                    },
                },
            );
            return NextResponse.json({
                success: true,
                message: aiMessage,
            });
        }
        if (regenerate) {
            const lastUserIndex = chat.messages
                .map((msg) => msg.role)
                .lastIndexOf("user");
            if (lastUserIndex === -1) {
                return NextResponse.json(
                    { error: "No user message to regenerate" },
                    { status: 400 },
                );
            }
            const messagesToKeep = chat.messages.slice(0, lastUserIndex + 1);
            const messages = messagesToKeep.map((msg) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            }));
            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: messages,
            });
            const aiMessage = response.text;
            await Chat.updateOne(
                { _id: chatId, userId },
                {
                    $set: {
                        messages: [
                            ...messagesToKeep,
                            {
                                role: "assistant",
                                content: aiMessage,
                                timestamp: Date.now(),
                            },
                        ],
                    },
                },
            );
            return NextResponse.json({
                success: true,
                message: aiMessage,
            });
        }
        const userMessage = {
            role: "user",
            content: message,
            timestamp: Date.now(),
        };
        const messages = [
            ...chat.messages.map((msg) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: messages,
        });
        const aiMessage = response.text;
        const updateData = {
            $push: {
                messages: {
                    $each: [
                        userMessage,
                        {
                            role: "assistant",
                            content: aiMessage,
                            timestamp: Date.now(),
                        },
                    ],
                },
            },
        };
        if (chat.name === "New Chat") {
            updateData.$set = {
                name:
                    message.length > 40
                        ? `${message.substring(0, 40)}...`
                        : message,
            };
        }
        await Chat.updateOne({ _id: chatId, userId }, updateData);
        return NextResponse.json({
            success: true,
            message: aiMessage,
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            { error: "Failed to generate AI response" },
            { status: 500 },
        );
    }
}
