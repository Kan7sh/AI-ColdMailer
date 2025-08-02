import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { EmailTable, UserTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await db.select().from(UserTable).limit(1);
    
    if (user.length === 0) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    const userId = user[0].id;

    const emails = await db.select().from(EmailTable).where(eq(EmailTable.userId, userId));

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, passKey, customPrompt } = body;

    // Get the first user
    const user = await db.select().from(UserTable).limit(1);
    
    if (user.length === 0) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Insert new email
    const [newEmail] = await db.insert(EmailTable).values({
      userId,
      email,
      passKey,
      customPrompt: customPrompt || null,
    }).returning();

    return NextResponse.json({ email: newEmail, message: "Email added successfully" });
  } catch (error) {
    console.error("Error adding email:", error);
    return NextResponse.json({ error: "Failed to add email" }, { status: 500 });
  }
} 