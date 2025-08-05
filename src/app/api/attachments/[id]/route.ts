import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { AttachmentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attachmentId = parseInt(params.id);
    
    const [attachment] = await db.select().from(AttachmentTable).where(eq(AttachmentTable.id, attachmentId));
    
    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
    }
    
    try {
      await unlink(attachment.fileLocation);
    } catch (fileError) {
      console.warn("File not found on filesystem:", attachment.fileLocation);
    }
    
    await db.delete(AttachmentTable).where(eq(AttachmentTable.id, attachmentId));
    
    return NextResponse.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 });
  }
}