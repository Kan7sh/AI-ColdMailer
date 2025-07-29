CREATE TABLE "attachment" (
	"id" serial NOT NULL,
	"recipientId" serial NOT NULL,
	"fileName" varchar NOT NULL,
	"fileLocation" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"university" varchar NOT NULL,
	"grade" varchar,
	"fieldOfStudy" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"email" varchar NOT NULL,
	"passKey" varchar NOT NULL,
	"customPrompt" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" serial NOT NULL,
	"userId" serial NOT NULL,
	"senderEmailId" serial NOT NULL,
	"recipientId" serial NOT NULL,
	"body" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pastExperience" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"companyName" varchar NOT NULL,
	"workContributed" varchar NOT NULL,
	"duration" varchar NOT NULL,
	"role" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" serial NOT NULL,
	"userId" serial NOT NULL,
	"projectName" varchar NOT NULL,
	"techUsed" varchar NOT NULL,
	"description" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipient" (
	"id" serial PRIMARY KEY NOT NULL,
	"senderEmailId" serial NOT NULL,
	"email" varchar NOT NULL,
	"companyName" varchar,
	"position" varchar,
	"areaOfInterest" varchar,
	"jobId" varchar,
	"includeProjects" boolean NOT NULL,
	"includePortfolio" boolean NOT NULL,
	"includeEducation" boolean NOT NULL,
	"includePastExperience" boolean NOT NULL,
	"customPrompt" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" serial NOT NULL,
	"userId" serial NOT NULL,
	"skillName" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phoneNumber" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "about" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "portfolioLink" varchar;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_recipientId_recipient_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."recipient"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email" ADD CONSTRAINT "email_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_senderEmailId_email_id_fk" FOREIGN KEY ("senderEmailId") REFERENCES "public"."email"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_recipientId_recipient_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."recipient"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pastExperience" ADD CONSTRAINT "pastExperience_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipient" ADD CONSTRAINT "recipient_senderEmailId_email_id_fk" FOREIGN KEY ("senderEmailId") REFERENCES "public"."email"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;