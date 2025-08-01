import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { UserTable, EducationTable, PastExperienceTable, SkillTable, ProjectsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get the first user (since there's no auth, we'll use the first user)
    const user = await db.select().from(UserTable).limit(1);
    
    if (user.length === 0) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Get all related data
    const [educations, experiences, skills, projects] = await Promise.all([
      db.select().from(EducationTable).where(eq(EducationTable.userId, userId)),
      db.select().from(PastExperienceTable).where(eq(PastExperienceTable.userId, userId)),
      db.select().from(SkillTable).where(eq(SkillTable.userId, userId)),
      db.select().from(ProjectsTable).where(eq(ProjectsTable.userId, userId)),
    ]);

    return NextResponse.json({
      user: user[0],
      educations,
      experiences,
      skills,
      projects,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, educations, experiences, skills, projects } = body;

    // Check if user exists
    const existingUser = await db.select().from(UserTable).limit(1);
    
    if (existingUser.length === 0) {
      // Create new user
      const [newUser] = await db.insert(UserTable).values({
        name: user.name,
        phoneNumber: user.phoneNumber,
        about: user.about || null,
        portfolioLink: user.portfolioLink || null,
      }).returning();

      const userId = newUser.id;

      // Insert related data
      if (educations && educations.length > 0) {
        await db.insert(EducationTable).values(
          educations.map((edu: any) => ({
            userId,
            university: edu.university,
            grade: edu.grade || null,
            fieldOfStudy: edu.fieldOfStudy || null,
          }))
        );
      }

      if (experiences && experiences.length > 0) {
        await db.insert(PastExperienceTable).values(
          experiences.map((exp: any) => ({
            userId,
            companyName: exp.companyName,
            role: exp.role,
            duration: exp.duration,
            workContributed: exp.workContributed,
          }))
        );
      }

      if (skills && skills.length > 0) {
        await db.insert(SkillTable).values(
          skills.map((skill: any) => ({
            userId,
            skillName: skill.skillName,
          }))
        );
      }

      if (projects && projects.length > 0) {
        await db.insert(ProjectsTable).values(
          projects.map((project: any) => ({
            userId,
            projectName: project.projectName,
            techUsed: project.techUsed,
            description: project.description,
          }))
        );
      }
    } else {
      // Update existing user
      const userId = existingUser[0].id;
      
      await db.update(UserTable)
        .set({
          name: user.name,
          phoneNumber: user.phoneNumber,
          about: user.about || null,
          portfolioLink: user.portfolioLink || null,
          updatedAt: new Date(),
        })
        .where(eq(UserTable.id, userId));

      // Delete existing related data
      await Promise.all([
        db.delete(EducationTable).where(eq(EducationTable.userId, userId)),
        db.delete(PastExperienceTable).where(eq(PastExperienceTable.userId, userId)),
        db.delete(SkillTable).where(eq(SkillTable.userId, userId)),
        db.delete(ProjectsTable).where(eq(ProjectsTable.userId, userId)),
      ]);

      // Insert new related data
      if (educations && educations.length > 0) {
        await db.insert(EducationTable).values(
          educations.map((edu: any) => ({
            userId,
            university: edu.university,
            grade: edu.grade || null,
            fieldOfStudy: edu.fieldOfStudy || null,
          }))
        );
      }

      if (experiences && experiences.length > 0) {
        await db.insert(PastExperienceTable).values(
          experiences.map((exp: any) => ({
            userId,
            companyName: exp.companyName,
            role: exp.role,
            duration: exp.duration,
            workContributed: exp.workContributed,
          }))
        );
      }

      if (skills && skills.length > 0) {
        await db.insert(SkillTable).values(
          skills.map((skill: any) => ({
            userId,
            skillName: skill.skillName,
          }))
        );
      }

      if (projects && projects.length > 0) {
        await db.insert(ProjectsTable).values(
          projects.map((project: any) => ({
            userId,
            projectName: project.projectName,
            techUsed: project.techUsed,
            description: project.description,
          }))
        );
      }
    }

    return NextResponse.json({ message: "Profile saved successfully" });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
} 