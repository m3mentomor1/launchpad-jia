// \src\app\api\add-career\route.ts
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import { sanitizeObject, validateCareerData } from "@/lib/security/sanitize";

export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    // Validate data structure
    const validation = validateCareerData(rawData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize all input data - description allows HTML, others are plain text
    const sanitizedData = sanitizeObject(rawData, ["description"]);

    const {
      jobTitle,
      description,
      questions,
      lastEditedBy,
      createdBy,
      screeningSetting,
      orgID,
      requireVideo,
      location,
      workSetup,
      workSetupRemarks,
      status,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      country,
      province,
      employmentType,
      cvSecretPrompt,
      preScreeningQuestions,
      aiSecretPrompt,
      teamMembers,
    } = sanitizedData;

    const { db } = await connectMongoDB();

    console.log("Looking for organization with ID:", orgID);
    console.log("Converted to ObjectId:", new ObjectId(orgID));

    const orgDetails = await db
      .collection("organizations")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(orgID),
          },
        },
        {
          $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
              {
                $addFields: {
                  _id: { $toString: "$_id" },
                },
              },
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$planId"] },
                },
              },
            ],
            as: "plan",
          },
        },
        {
          $unwind: {
            path: "$plan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    if (!orgDetails || orgDetails.length === 0) {
      console.log("Organization not found. Checking all organizations...");
      const allOrgs = await db
        .collection("organizations")
        .find({})
        .limit(5)
        .toArray();
      console.log(
        "Sample organizations:",
        allOrgs.map((o) => ({ _id: o._id, name: o.name }))
      );
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const totalActiveCareers = await db
      .collection("careers")
      .countDocuments({ orgID, status: "active" });

    // Get job limit from plan object or use default
    const jobLimit = orgDetails[0].plan?.jobLimit || 999;
    const extraJobSlots = orgDetails[0].extraJobSlots || 0;
    const totalAllowedJobs = jobLimit + extraJobSlots;

    console.log(
      "Job limits - Total active:",
      totalActiveCareers,
      "Allowed:",
      totalAllowedJobs
    );

    if (totalActiveCareers >= totalAllowedJobs) {
      return NextResponse.json(
        { error: "You have reached the maximum number of jobs for your plan" },
        { status: 400 }
      );
    }

    // Additional validation: ensure status is valid
    const validStatuses = ["active", "inactive", "draft"];
    const careerStatus = validStatuses.includes(status) ? status : "inactive";

    // Ensure numeric fields are properly typed
    const parsedMinSalary =
      minimumSalary !== null && minimumSalary !== undefined
        ? Number(minimumSalary)
        : null;
    const parsedMaxSalary =
      maximumSalary !== null && maximumSalary !== undefined
        ? Number(maximumSalary)
        : null;

    // Validate salary range
    if (
      parsedMinSalary !== null &&
      parsedMaxSalary !== null &&
      parsedMinSalary > parsedMaxSalary
    ) {
      return NextResponse.json(
        { error: "Minimum salary cannot be greater than maximum salary" },
        { status: 400 }
      );
    }

    const career = {
      id: guid(),
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: careerStatus,
      screeningSetting,
      orgID,
      requireVideo: Boolean(requireVideo),
      lastActivityAt: new Date(),
      salaryNegotiable: Boolean(salaryNegotiable),
      minimumSalary: parsedMinSalary,
      maximumSalary: parsedMaxSalary,
      country,
      province,
      employmentType,
      cvSecretPrompt: cvSecretPrompt || "",
      preScreeningQuestions: preScreeningQuestions || [],
      aiSecretPrompt: aiSecretPrompt || "",
      teamMembers: teamMembers || [],
    };

    await db.collection("careers").insertOne(career);

    // Don't return sensitive data in response
    const { cvSecretPrompt: _, aiSecretPrompt: __, ...safeCareer } = career;

    return NextResponse.json(
      {
        message: "Career added successfully",
        career: safeCareer,
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
    console.error("Error adding career:", error);

    // Don't expose internal error details to client
    const errorMessage = error.message?.includes("duplicate key")
      ? "A career with this information already exists"
      : "Failed to add career. Please try again.";

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
