"use client";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Plus, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { createPrompt } from "@/service/createPrompt";
import { getAIEmail } from "@/service/aiMailService";
import { sendEmail } from "@/service/nodemailer";

const RecipientFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().optional(),
  companyName: z.string().optional(),
  position: z.string().optional(),
  areaOfInterest: z.string().optional(),
  jobId: z.string().optional(),
  includeProjects: z.boolean(),
  includePortfolio: z.boolean(),
  includeEducation: z.boolean(),
  includePastExperience: z.boolean(),
  customPrompt: z.string().optional(),
});

type RecipientFormData = z.infer<typeof RecipientFormSchema>;

interface DashboardProps {
  selectedEmail?: any;
}

const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  about: z.string().optional(),
  portfolioLink: z.string().optional(),
  educations: z.array(
    z.object({
      university: z.string().min(1, "University is required"),
      grade: z.string().optional(),
      fieldOfStudy: z.string().optional(),
    })
  ),
  experiences: z.array(
    z.object({
      companyName: z.string().min(1, "Company name is required"),
      role: z.string().min(1, "Role is required"),
      duration: z.string().min(1, "Duration is required"),
      workContributed: z.string().min(1, "Work contributed is required"),
    })
  ),
  skills: z.array(
    z.object({
      skillName: z.string().min(1, "Skill name is required"),
    })
  ),
  projects: z.array(
    z.object({
      projectName: z.string().min(1, "Project name is required"),
      techUsed: z.string().min(1, "Tech used is required"),
      description: z.string().min(1, "Description is required"),
    })
  ),
});

type UserProfileData = z.infer<typeof UserProfileSchema>;

export default function Dashboard({ selectedEmail }: DashboardProps) {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const profileData = await response.json();

          const user = UserProfileSchema.safeParse({
            name: profileData.user.name,
            phoneNumber: profileData.user.phoneNumber,
            about: profileData.user.about || "",
            portfolioLink: profileData.user.portfolioLink || "",
            educations:
              profileData.educations.length > 0
                ? profileData.educations.map((edu: any) => ({
                    university: edu.university,
                    grade: edu.grade || "",
                    fieldOfStudy: edu.fieldOfStudy || "",
                  }))
                : [{ university: "", grade: "", fieldOfStudy: "" }],
            experiences:
              profileData.experiences.length > 0
                ? profileData.experiences.map((exp: any) => ({
                    companyName: exp.companyName,
                    role: exp.role,
                    duration: exp.duration,
                    workContributed: exp.workContributed,
                  }))
                : [
                    {
                      companyName: "",
                      role: "",
                      duration: "",
                      workContributed: "",
                    },
                  ],
            skills:
              profileData.skills.length > 0
                ? profileData.skills.map((skill: any) => ({
                    skillName: skill.skillName,
                  }))
                : [{ skillName: "" }],
            projects:
              profileData.projects.length > 0
                ? profileData.projects.map((project: any) => ({
                    projectName: project.projectName,
                    techUsed: project.techUsed,
                    description: project.description,
                  }))
                : [{ projectName: "", techUsed: "", description: "" }],
          });
          if (user.success) {
            setUserData(user.data);
          } else {
            toast.error("Not able to load user's profile");
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const form = useForm<RecipientFormData>({
    resolver: zodResolver(RecipientFormSchema),
    defaultValues: {
      email: "",
      name: "",
      companyName: "",
      position: "",
      areaOfInterest: "",
      jobId: "",
      includeProjects: false,
      includePortfolio: false,
      includeEducation: false,
      includePastExperience: false,
      customPrompt: "",
    },
  });

  useEffect(() => {
    if (selectedEmail) {
      loadRecipients();
    } else {
      setRecipients([]);
    }
  }, [selectedEmail]);

  const loadRecipients = async () => {
    if (!selectedEmail) return;

    try {
      setIsLoadingRecipients(true);
      const response = await fetch(
        `/api/recipients?emailId=${selectedEmail.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setRecipients(data.recipients);
      }
    } catch (error) {
      console.error("Error loading recipients:", error);
    } finally {
      setIsLoadingRecipients(false);
    }
  };

  const handleAddRecipient = () => {
    if (!selectedEmail) {
      toast.error("Please select an email first");
      return;
    }
    setEditingRecipient(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open && !selectedEmail) {
      toast.error("Please select an email first");
      return;
    }
    setIsDialogOpen(open);
  };

  const handleEditRecipient = (recipient: any) => {
    setEditingRecipient(recipient);
    form.reset({
      email: recipient.email,
      name: recipient.name || "",
      companyName: recipient.companyName || "",
      position: recipient.position || "",
      areaOfInterest: recipient.areaOfInterest || "",
      jobId: recipient.jobId || "",
      includeProjects: recipient.includeProjects,
      includePortfolio: recipient.includePortfolio,
      includeEducation: recipient.includeEducation,
      includePastExperience: recipient.includePastExperience,
      customPrompt: recipient.customPrompt || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteRecipient = async (recipientId: number) => {
    try {
      const response = await fetch(`/api/recipients/${recipientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Recipient deleted successfully");
        loadRecipients();
      } else {
        toast.error("Failed to delete recipient");
      }
    } catch (error) {
      console.error("Error deleting recipient:", error);
      toast.error("Failed to delete recipient");
    }
  };

  const sendEmailToUser = async (recipientIndex: number) => {
    const recipient: RecipientFormData = recipients[recipientIndex];
    if (!userData) {
      toast.error("User profile not loaded");
      return;
    }
    const prompt = createPrompt({
      senderName: userData.name,
      senderPhoneNumber: userData.phoneNumber,
      aboutSender: userData.about,
      senderPortfolio: userData.portfolioLink,
      senderEducation: userData.educations?.map(
        (edu) =>
          `University: ${edu.university}${
            edu.grade ? `, Grade: ${edu.grade}` : ""
          }${edu.fieldOfStudy ? `, Field: ${edu.fieldOfStudy}` : ""}`
      ),
      senderExperiences: userData.experiences?.map(
        (exp) =>
          `Company: ${exp.companyName}, Role: ${exp.role}, Duration: ${exp.duration}, Work: ${exp.workContributed}`
      ),
      senderSkills: userData.skills?.map((skill) => skill.skillName),
      senderProjects: userData.projects?.map(
        (proj) =>
          `Project: ${proj.projectName}, Tech: ${proj.techUsed}, Description: ${proj.description}`
      ),
      recipientName: recipient.name,
      companyName: recipient.companyName,
      positionForCompany: recipient.position,
      areaOfInterest: recipient.areaOfInterest,
      jobId: recipient.jobId,
      includeProjects: recipient.includeProjects,
      includePortfolio: recipient.includePortfolio,
      includeEducation: recipient.includeEducation,
      includePastExperiences: recipient.includePastExperience,
      customPrompt: recipient.customPrompt,
      attachmentsAdded: false,
    });

    console.log(prompt);

    try {
      const [subject, body] = await getAIEmail({ prompt });
      console.log(subject);
      console.log(body);
      try {
        await sendEmail({
          senderEmail: selectedEmail.email,
          recipientEmail: recipient.email,
          subject,
          body,
          senderPassword: selectedEmail.passKey,
        });
      } catch (e) {
        toast("There was an error sending the Email.");
      }
    } catch (e) {
      toast("There was an error while generating the Email.");
      return;
    }

    toast("Email Sent");
  };

  const onSubmit = async (data: RecipientFormData) => {
    try {
      if (!selectedEmail) {
        toast.error("Please select an email first");
        return;
      }

      const url = editingRecipient
        ? `/api/recipients/${editingRecipient.id}`
        : "/api/recipients";
      const method = editingRecipient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          senderEmailId: selectedEmail.id,
        }),
      });

      if (response.ok) {
        toast.success(
          editingRecipient
            ? "Recipient updated successfully"
            : "Recipient added successfully"
        );
        setIsDialogOpen(false);
        form.reset();
        setEditingRecipient(null);
        loadRecipients();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save recipient");
      }
    } catch (error) {
      console.error("Error saving recipient:", error);
      toast.error("Failed to save recipient");
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div className="p-3 flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div>AI COLD MAILER</div>
          {selectedEmail && (
            <div className="text-sm text-muted-foreground">
              Selected: {selectedEmail.email}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant={"outline"} onClick={handleAddRecipient}>
                <Plus />
                <div>Add Recipient</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingRecipient ? "Edit Recipient" : "Add Recipient"}
                </DialogTitle>
                <DialogDescription>
                  {editingRecipient
                    ? "Edit recipient details."
                    : "Add a new recipient for your cold email campaign."}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter recipient email"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      {...form.register("companyName")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Enter position"
                      {...form.register("position")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaOfInterest">Area of Interest</Label>
                    <Input
                      id="areaOfInterest"
                      placeholder="Enter area of interest"
                      {...form.register("areaOfInterest")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobId">Job ID</Label>
                    <Input
                      id="jobId"
                      placeholder="Enter job ID"
                      {...form.register("jobId")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Reciever name</Label>
                    <Input
                      id="name"
                      placeholder="Enter name"
                      {...form.register("name")}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Include in Email</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeProjects"
                        {...form.register("includeProjects")}
                      />
                      <Label htmlFor="includeProjects">Include Projects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includePortfolio"
                        {...form.register("includePortfolio")}
                      />
                      <Label htmlFor="includePortfolio">
                        Include Portfolio
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeEducation"
                        {...form.register("includeEducation")}
                      />
                      <Label htmlFor="includeEducation">
                        Include Education
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includePastExperience"
                        {...form.register("includePastExperience")}
                      />
                      <Label htmlFor="includePastExperience">
                        Include Past Experience
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customPrompt">Custom Prompt</Label>
                  <Textarea
                    id="customPrompt"
                    placeholder="Enter custom prompt (optional)"
                    {...form.register("customPrompt")}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {editingRecipient ? "Update Recipient" : "Add Recipient"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator />
      {/* <Progress value={33} className="rounded-none " /> */}

      <div className="mt-3 p-8">
        {!selectedEmail ? (
          <div className="text-center text-muted-foreground py-8">
            Please select an email from the sidebar to view recipients
          </div>
        ) : isLoadingRecipients ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-2">
                <Card className="p-5">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                      <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div className="h-8 bg-muted animate-pulse rounded w-20"></div>
                      <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
                      <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : recipients.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No recipients found for this email. Add your first recipient!
          </div>
        ) : (
          recipients.map((recipient, index) => (
            <div key={recipient.id} className="py-2">
              <Card className="p-5">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <div className="font-medium">{recipient.email}</div>
                    <div className="text-muted-foreground text-sm">
                      {recipient.companyName && `${recipient.companyName}`}
                      {recipient.position && ` • ${recipient.position}`}
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditRecipient(recipient)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEditRecipient(recipient)}
                    >
                      Edit
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32 p-0">
                        <div className="flex flex-col">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="text-xs w-full rounded-none text-red-500 hover:text-red-600"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Recipient
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {recipient.email}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteRecipient(recipient.id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button onClick={() => sendEmailToUser(index)}>Send</Button>
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
