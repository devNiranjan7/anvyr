import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        messages: [
            {
                role: { type: String, required: true },
                content: { type: String, required: true },
                timestamp: { type: Number, required: true },
            },
        ],
        userId: { type: String, required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
