import { Webhook } from "svix";
import connectDB from "@/config/db.js";
import User from "@/models/user.js";
import { headers } from "next/headers.js";
import { NextResponse } from "next/server.js";

export async function POST(req) {
    try {
        const wh = new Webhook(process.env.SIGNING_SECRET);
        const headerPayload = await headers();
        const svixHeaders = {
            "svix-id": headerPayload.get("svix-id"),
            "svix-timestamp": headerPayload.get("svix-timestamp"),
            "svix-signature": headerPayload.get("svix-signature"),
        };
        const body = await req.text();
        const { data, type } = wh.verify(body, svixHeaders);

        console.log(`Clerk webhook received: ${type}`);
        await connectDB();

        if (type === "user.deleted") {
            await User.findByIdAndDelete(data.id);
        } else if (type === "user.created" || type === "user.updated") {
            const email = data.email_addresses?.[0]?.email_address;
            if (!email) {
                throw new Error(`Clerk user ${data.id} has no email address`);
            }

            await User.findByIdAndUpdate(
                data.id,
                {
                    _id: data.id,
                    email,
                    name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                    image: data.image_url,
                },
                { upsert: true, new: true, runValidators: true },
            );
            console.log(`MongoDB user synchronized: ${data.id}`);
        }

        return NextResponse.json({ message: "Event received" });
    } catch (error) {
        console.error("Clerk webhook failed:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 },
        );
    }
}
