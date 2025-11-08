// src/app/api/admin/update-org-job-slots/route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { orgID, extraJobSlots } = await request.json();

    if (!orgID || extraJobSlots === undefined) {
      return NextResponse.json(
        { error: "orgID and extraJobSlots are required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const result = await db
      .collection("organizations")
      .updateOne(
        { _id: new ObjectId(orgID) },
        { $set: { extraJobSlots: parseInt(extraJobSlots) } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Extra job slots updated successfully",
      extraJobSlots,
    });
  } catch (error) {
    console.error("Error updating extra job slots:", error);
    return NextResponse.json(
      { error: "Failed to update extra job slots" },
      { status: 500 }
    );
  }
}
