"use client";

import * as React from "react";
import { Menu, MoreVertical, Plus, PlusIcon } from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface AppSidebarProps {
  onProfileClick?: () => void;
}

export function AppSidebar({ onProfileClick }: AppSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const AddEmailFormSchema = z.object({
    email: z.string().min(1, "Please enter the email"),
    passKey: z.string().min(1, "Please enter the pass key"),
    customPrompt: z.string(),
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
      customPrompt: "",
    },
  });

  return (
    <Sidebar className="overflow-hidden" collapsible="icon">
      <SidebarHeader className="gap-0">
        <SidebarGroup className="p-3.5 ">
          <SidebarGroupLabel>Emails</SidebarGroupLabel>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <SidebarGroupAction title="Add Email" asChild>
                <div className="h-8 w-8 flex items-center justify-center">
                  <PlusIcon />
                </div>
              </SidebarGroupAction>
            </DialogTrigger>
            <DialogContent>
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

                  <div className="grid gap-3">
                    <Label htmlFor="customPrompt">Prompt</Label>
                    <Textarea
                      id="customPompt"
                      {...form.register("customPrompt")}
                      placeholder="Optional Prompt"
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
          <SidebarGroupContent className="group-data-[state=collapsed]:hidden"></SidebarGroupContent>
        </SidebarGroup>

        <Separator className="m-0 p-0" />
      </SidebarHeader>
      <SidebarContent>
        {[0, 1, 2].map((value, index) => {
          return (
            <div key={index} className="bg-zinc-800 mx-3 py-3 px-2 rounded-md flex flex-row justify-between items-center">
              <div className="text-[0.675rem]">
                kanishchhabra.work@gmail.com
              </div>
              <Popover>
                <PopoverTrigger>
                  <MoreVertical className="text-zinc-700 w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent className="w-20 p-0">
                  <div className="flex justify-center items-center ">
                    <Button variant={"ghost"} className="text-xs w-20">Edit</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="mb-3">
        <Card className="p-3 cursor-pointer hover:bg-accent transition-colors" onClick={onProfileClick}>
          <div className="flex flex-col">
            <div>Kanish Chhabra</div>
            <div className="text-muted-foreground text-xs">Profile</div>
          </div>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
