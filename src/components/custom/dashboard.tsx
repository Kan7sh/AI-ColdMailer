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
} from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const RecipientFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
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

export default function Dashboard() {
  const testData = ["Amazon", "Microsoft", "Google"];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<RecipientFormData>({
    resolver: zodResolver(RecipientFormSchema),
    defaultValues: {
      email: "",
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

  const onSubmit = (data: RecipientFormData) => {
    console.log("Adding recipient:", data);
    //TODO
    setIsDialogOpen(false);
    form.reset();
  };
  return (
    <div className="flex flex-col w-full">
      <div className="p-3 flex flex-row justify-between items-center">
        <div>AI COLD MAILER</div>
        <div className="flex flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>
                <Plus />
                <div>Add Recipient</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Recipient</DialogTitle>
                <DialogDescription>
                  Add a new recipient for your cold email campaign.
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

                <div className="space-y-2">
                  <Label htmlFor="jobId">Job ID</Label>
                  <Input
                    id="jobId"
                    placeholder="Enter job ID"
                    {...form.register("jobId")}
                  />
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
                  <Button type="submit">Add Recipient</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button>Send to all</Button>
        </div>
      </div>
      <Separator />
      <Progress value={33} className="rounded-none " />

      <div className="mt-3 p-8">
        {testData.map((value, index) => {
          return (
            <div className="py-2">
              <Card className="p-5">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <div>This is the test</div>
                    <div className="text-muted-foreground text-sm">
                      ABC@gmail.com
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button variant={"secondary"}>View Details</Button>
                    <Button variant={"outline"}>Edit</Button>
                    <Button>Send</Button>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
