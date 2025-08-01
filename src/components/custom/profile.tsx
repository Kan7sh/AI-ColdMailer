"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  about: z.string().optional(),
  portfolioLink: z.string().optional(),
  educations: z.array(z.object({
    university: z.string().min(1, "University is required"),
    grade: z.string().optional(),
    fieldOfStudy: z.string().optional(),
  })),
  experiences: z.array(z.object({
    companyName: z.string().min(1, "Company name is required"),
    role: z.string().min(1, "Role is required"),
    duration: z.string().min(1, "Duration is required"),
    workContributed: z.string().min(1, "Work contributed is required"),
  })),
  skills: z.array(z.object({
    skillName: z.string().min(1, "Skill name is required"),
  })),
  projects: z.array(z.object({
    projectName: z.string().min(1, "Project name is required"),
    techUsed: z.string().min(1, "Tech used is required"),
    description: z.string().min(1, "Description is required"),
  })),
});

type UserProfileData = z.infer<typeof UserProfileSchema>;

interface ProfileProps {
  onProfileSaved?: () => void;
}

export default function Profile({ onProfileSaved }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<UserProfileData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      about: "",
      portfolioLink: "",
      educations: [
        { university: "", grade: "", fieldOfStudy: "" }
      ],
      experiences: [
        { companyName: "", role: "", duration: "", workContributed: "" }
      ],
      skills: [
        { skillName: "" }
      ],
      projects: [
        { projectName: "", techUsed: "", description: "" }
      ],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const profileData = await response.json();
          
          // Set form data with loaded profile
          form.reset({
            name: profileData.user.name,
            phoneNumber: profileData.user.phoneNumber,
            about: profileData.user.about || "",
            portfolioLink: profileData.user.portfolioLink || "",
            educations: profileData.educations.length > 0 
              ? profileData.educations.map((edu: any) => ({
                  university: edu.university,
                  grade: edu.grade || "",
                  fieldOfStudy: edu.fieldOfStudy || "",
                }))
              : [{ university: "", grade: "", fieldOfStudy: "" }],
            experiences: profileData.experiences.length > 0
              ? profileData.experiences.map((exp: any) => ({
                  companyName: exp.companyName,
                  role: exp.role,
                  duration: exp.duration,
                  workContributed: exp.workContributed,
                }))
              : [{ companyName: "", role: "", duration: "", workContributed: "" }],
            skills: profileData.skills.length > 0
              ? profileData.skills.map((skill: any) => ({
                  skillName: skill.skillName,
                }))
              : [{ skillName: "" }],
            projects: profileData.projects.length > 0
              ? profileData.projects.map((project: any) => ({
                  projectName: project.projectName,
                  techUsed: project.techUsed,
                  description: project.description,
                }))
              : [{ projectName: "", techUsed: "", description: "" }],
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [form]);

  const onSubmit = async (data: UserProfileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: data.name,
            phoneNumber: data.phoneNumber,
            about: data.about,
            portfolioLink: data.portfolioLink,
          },
          educations: data.educations.filter(edu => edu.university.trim() !== ""),
          experiences: data.experiences.filter(exp => exp.companyName.trim() !== ""),
          skills: data.skills.filter(skill => skill.skillName.trim() !== ""),
          projects: data.projects.filter(project => project.projectName.trim() !== ""),
        }),
      });

      if (response.ok) {
        toast.success("Profile saved successfully!");
        setIsEditing(false);
        // Call the callback to refresh user state in sidebar
        onProfileSaved?.();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills & Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    {...form.register("phoneNumber")}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  {...form.register("about")}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioLink">Portfolio Link</Label>
                <Input
                  id="portfolioLink"
                  {...form.register("portfolioLink")}
                  disabled={!isEditing}
                  placeholder="Enter your portfolio URL"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Education</CardTitle>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendEducation({ university: "", grade: "", fieldOfStudy: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    {isEditing && educationFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`educations.${index}.university`}>University *</Label>
                      <Input
                        {...form.register(`educations.${index}.university`)}
                        disabled={!isEditing}
                        placeholder="Enter university name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`educations.${index}.grade`}>Grade</Label>
                      <Input
                        {...form.register(`educations.${index}.grade`)}
                        disabled={!isEditing}
                        placeholder="Enter grade"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`educations.${index}.fieldOfStudy`}>Field of Study</Label>
                    <Input
                      {...form.register(`educations.${index}.fieldOfStudy`)}
                      disabled={!isEditing}
                      placeholder="Enter field of study"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Work Experience</CardTitle>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendExperience({ companyName: "", role: "", duration: "", workContributed: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    {isEditing && experienceFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`experiences.${index}.companyName`}>Company Name *</Label>
                      <Input
                        {...form.register(`experiences.${index}.companyName`)}
                        disabled={!isEditing}
                        placeholder="Enter company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`experiences.${index}.role`}>Role *</Label>
                      <Input
                        {...form.register(`experiences.${index}.role`)}
                        disabled={!isEditing}
                        placeholder="Enter your role"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experiences.${index}.duration`}>Duration *</Label>
                    <Input
                      {...form.register(`experiences.${index}.duration`)}
                      disabled={!isEditing}
                      placeholder="e.g., Jan 2023 - Dec 2023"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`experiences.${index}.workContributed`}>Work Contributed *</Label>
                    <Textarea
                      {...form.register(`experiences.${index}.workContributed`)}
                      disabled={!isEditing}
                      placeholder="Describe your contributions and achievements"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skills</CardTitle>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSkill({ skillName: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...form.register(`skills.${index}.skillName`)}
                        placeholder="Enter skill name"
                      />
                      {skillFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.watch("skills").map((skill, index) => (
                    skill.skillName && (
                      <Badge key={index} variant="secondary">
                        {skill.skillName}
                      </Badge>
                    )
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Projects</CardTitle>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendProject({ projectName: "", techUsed: "", description: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    {isEditing && projectFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`projects.${index}.projectName`}>Project Name *</Label>
                      <Input
                        {...form.register(`projects.${index}.projectName`)}
                        disabled={!isEditing}
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`projects.${index}.techUsed`}>Tech Used *</Label>
                      <Input
                        {...form.register(`projects.${index}.techUsed`)}
                        disabled={!isEditing}
                        placeholder="e.g., React, Node.js, TypeScript"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`projects.${index}.description`}>Description *</Label>
                    <Textarea
                      {...form.register(`projects.${index}.description`)}
                      disabled={!isEditing}
                      placeholder="Describe your project"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 