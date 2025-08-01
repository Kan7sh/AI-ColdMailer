import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { RecipientTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      email, 
      companyName, 
      position, 
      areaOfInterest, 
      jobId,
      includeProjects,
      includePortfolio,
      includeEducation,
      includePastExperience,
      customPrompt 
    } = body;
    const recipientId = parseInt(params.id);

    // Update recipient
    const [updatedRecipient] = await db.update(RecipientTable)
      .set({
        email,
        companyName: companyName || null,
        position: position || null,
        areaOfInterest: areaOfInterest || null,
        jobId: jobId || null,
        includeProjects: includeProjects || false,
        includePortfolio: includePortfolio || false,
        includeEducation: includeEducation || false,
        includePastExperience: includePastExperience || false,
        customPrompt: customPrompt || null,
        updatedAt: new Date(),
      })
      .where(eq(RecipientTable.id, recipientId))
      .returning();

    if (!updatedRecipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    return NextResponse.json({ recipient: updatedRecipient, message: "Recipient updated successfully" });
  } catch (error) {
    console.error("Error updating recipient:", error);
    return NextResponse.json({ error: "Failed to update recipient" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipientId = parseInt(params.id);

    // Delete recipient
    const [deletedRecipient] = await db.delete(RecipientTable)
      .where(eq(RecipientTable.id, recipientId))
      .returning();

    if (!deletedRecipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recipient deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipient:", error);
    return NextResponse.json({ error: "Failed to delete recipient" }, { status: 500 });
  }
} 