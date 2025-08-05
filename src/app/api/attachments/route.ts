import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { AttachmentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId");

    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient ID is required" },
        { status: 400 }
      );
    }

    const attachments = await db
      .select()
      .from(AttachmentTable)
      .where(eq(AttachmentTable.recipientId, parseInt(recipientId)));

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const recipientId = formData.get("recipientId") as string;

    if (!recipientId || files.length === 0) {
      return NextResponse.json(
        { error: "Recipient ID and files are required" },
        { status: 400 }
      );
    }

    const uploadedAttachments = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(
        process.cwd(),
        "uploads",
        `recipient_${recipientId}`
      );
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      const [attachment] = await db
        .insert(AttachmentTable)
        .values({
          recipientId: parseInt(recipientId),
          fileName: file.name,
          fileLocation: filePath,
        })
        .returning();

      uploadedAttachments.push(attachment);
    }

    return NextResponse.json({
      attachments: uploadedAttachments,
      message: "Attachments uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading attachments:", error);
    return NextResponse.json(
      { error: "Failed to upload attachments" },
      { status: 500 }
    );
  }
}
