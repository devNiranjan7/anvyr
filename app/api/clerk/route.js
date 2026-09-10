import { Webhook } from "svix";
import connectDB from "@/config/db.js";
import User from "@/models/user.js";
import { headers } from "next/headers.js";
import { NextResponse } from "next/server.js";

export async function POST(req) {
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayload = await headers();
    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
    };
    const body = await req.text();
    wh.verify(body, svixHeaders);
    const { data, type } = JSON.parse(body);
    const userData = {
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
    };
    await connectDB();
    switch (type) {
        case "user.created":
        case "user.updated":
            await User.findByIdAndUpdate(data.id, userData, {
                upsert: true,
                new: true,
                runValidators: true,
            });
            break;

        case "user.deleted":
            await User.findByIdAndDelete(data.id);
            break;

        default:
            break;
    }
    return NextResponse.json({ message: "Event received" });
}
