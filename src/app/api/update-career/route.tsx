// src/app/api/update-career/route.tsx
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";
import { sanitizeObject, validateCareerData } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    let rawData = await request.json();
    const { _id } = rawData;

    // Validate data structure
    const validation = validateCareerData(rawData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize all input data - description allows HTML
    const requestData = sanitizeObject(rawData, ["description"]);

    // Validate required fields
    if (!_id) {
      return NextResponse.json(
        { error: "Job Object ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    let dataUpdates = { ...requestData };

    delete dataUpdates._id;

    const career = {
      ...dataUpdates,
    };

    await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(_id) }, { $set: career });

    return NextResponse.json(
      {
        message: "Career updated successfully",
        career,
      },
      {
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      }
    );
  } catch (error: any) {
    console.error("Error updating career:", error);

    const errorMessage = error.message?.includes("duplicate key")
      ? "A career with this information already exists"
      : "Failed to update career. Please try again.";

    return NextResponse.json(
      { error: errorMessage },
      {
        status: 500,
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
      }
    );
  }
}
