"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export function AppSidebar() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const AddEmailFormSchema = z.object({
    email: z.string().min(1, "Please enter the email"),
    passKey: z.string().min(1, "Please enter the pass key"),
  });

  const addEmail = (data: z.infer<typeof AddEmailFormSchema>) => {
    console.log("Adding email:", data);
    setIsDialogOpen(false);
    form.reset();
  };

  const form = useForm<z.infer<typeof AddEmailFormSchema>>({
    resolver: zodResolver(AddEmailFormSchema),
    defaultValues: {
      email: "",
      passKey: "",
    },
  });

  return (
    <Sidebar className="overflow-hidden" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-row justify-between items-center w-full">
            <div>Emails</div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Plus className="h-5" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Email</DialogTitle>
                  <DialogDescription>
                    Add a new email account to your profile.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(addEmail)}>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...form.register("email")}
                        placeholder="Enter email address"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="passKey">Pass Key</Label>
                      <Input
                        id="passKey"
                        type="password"
                        {...form.register("passKey")}
                        placeholder="Enter pass key"
                      />
                      {form.formState.errors.passKey && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.passKey.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add Email</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarGroup>
        <Separator />
      </SidebarContent>
    </Sidebar>
  );
}
