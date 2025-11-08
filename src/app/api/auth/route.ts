// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function POST(request: Request) {
  try {
    const { name, email, image } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    // Check if user is a super admin first
    const admin = await db.collection("admins").findOne({ email: email });

    if (admin) {
      await db.collection("admins").updateOne(
        { email: email },
        {
          $set: {
            name: name,
            image: image,
            lastSeen: new Date(),
          },
        }
      );

      return NextResponse.json({
        ...admin,
        role: "admin",
      });
    }

    // ✅ NEW: Check if user is a member (recruiter/hiring manager)
    const member = await db.collection("members").findOne({ email: email });

    if (member) {
      // Update member's last login
      await db.collection("members").updateOne(
        { email: email },
        {
          $set: {
            name: name,
            image: image,
            lastLogin: new Date(),
          },
        }
      );

      return NextResponse.json({
        email: member.email,
        name: member.name || name,
        image: member.image || image,
        role: "admin", // Member = recruiter/admin role
        orgID: member.orgID,
      });
    }

    // Check if user is an applicant
    const applicant = await db
      .collection("applicants")
      .findOne({ email: email });

    if (applicant) {
      return NextResponse.json({
        ...applicant,
        role: "applicant",
      });
    }

    // If not found anywhere, create new applicant
    const newApplicant = {
      email: email,
      name: name,
      image: image,
      createdAt: new Date(),
      lastSeen: new Date(),
      role: "applicant",
    };

    await db.collection("applicants").insertOne(newApplicant);

    return NextResponse.json(newApplicant);
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
