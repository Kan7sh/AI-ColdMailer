import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { RecipientTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get('emailId');

    if (!emailId) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 });
    }

    const recipients = await db.select().from(RecipientTable).where(eq(RecipientTable.senderEmailId, parseInt(emailId)));

    return NextResponse.json({ recipients });
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return NextResponse.json({ error: "Failed to fetch recipients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      senderEmailId,
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

    const [newRecipient] = await db.insert(RecipientTable).values({
      senderEmailId: parseInt(senderEmailId),
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
    }).returning();

    return NextResponse.json({ recipient: newRecipient, message: "Recipient added successfully" });
  } catch (error) {
    console.error("Error adding recipient:", error);
    return NextResponse.json({ error: "Failed to add recipient" }, { status: 500 });
  }
} 