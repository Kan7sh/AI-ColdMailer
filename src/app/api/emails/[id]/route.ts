import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { EmailTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { email, passKey, customPrompt } = body;
    const emailId = parseInt(params.id);

    // Update email
    const [updatedEmail] = await db.update(EmailTable)
      .set({
        email,
        passKey,
        customPrompt: customPrompt || null,
        updatedAt: new Date(),
      })
      .where(eq(EmailTable.id, emailId))
      .returning();

    if (!updatedEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ email: updatedEmail, message: "Email updated successfully" });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const emailId = parseInt(params.id);

    // Delete email
    const [deletedEmail] = await db.delete(EmailTable)
      .where(eq(EmailTable.id, emailId))
      .returning();

    if (!deletedEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Email deleted successfully" });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json({ error: "Failed to delete email" }, { status: 500 });
  }
} 