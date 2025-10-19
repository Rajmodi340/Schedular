import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username } = body || {};
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    let currentUserRow = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!currentUserRow) {
      // Create the user record on first touch
      const clerkU = await currentUser();
      const primaryEmail = clerkU?.primaryEmailAddress?.emailAddress || clerkU?.emailAddresses?.[0]?.emailAddress;
      const fullName = [clerkU?.firstName, clerkU?.lastName].filter(Boolean).join(" ") || null;
      const imageUrl = clerkU?.imageUrl || null;

      try {
        currentUserRow = await db.user.create({
          data: {
            clerkUserId: userId,
            email: primaryEmail,
            username: null,
            name: fullName,
            imageUrl,
          },
        });
      } catch (e) {
        return NextResponse.json({ error: e?.message || "Failed to create user" }, { status: 500 });
      }
    }

    if (currentUserRow.username === username) {
      return NextResponse.json({ success: true });
    }

    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser && existingUser.clerkUserId !== userId) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    await db.user.update({ where: { clerkUserId: userId }, data: { username } });
    // Best-effort sync to Clerk; guard in case clerkClient shape varies
    try {
      if (clerkClient?.users?.updateUser) {
        await clerkClient.users.updateUser(userId, { username });
      }
    } catch (_) {
      // ignore Clerk sync errors
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}


