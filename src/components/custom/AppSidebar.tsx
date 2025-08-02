"use client";

import * as React from "react";
import { Menu, MoreVertical, Plus, PlusIcon, User } from "lucide-react";
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
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../ui/alert-dialog";

interface AppSidebarProps {
  onProfileClick?: () => void;
  onEmailClick?: (email: any) => void;
}

export function AppSidebar({ onProfileClick, onEmailClick }: AppSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingEmail, setEditingEmail] = React.useState<any>(null);
  const [emails, setEmails] = React.useState<any[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = React.useState(true);
  const [selectedEmail, setSelectedEmail] = React.useState<any>(null);
  const { user, isLoading } = useUser();

  const AddEmailFormSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    passKey: z.string().min(1, "Please enter the pass key"),
    customPrompt: z.string().optional(),
  });

  // Load emails on component mount and when user changes
  React.useEffect(() => {
    if (user) {
      loadEmails();
    } else {
      setEmails([]);
      setIsLoadingEmails(false);
    }
  }, [user]);

  const loadEmails = async () => {
    try {
      setIsLoadingEmails(true);
      const response = await fetch("/api/emails");
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails);
      }
    } catch (error) {
      console.error("Error loading emails:", error);
      toast.error("Failed to load emails");
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleAddEmailClick = () => {
    if (!user) {
      toast.error("Please add user details first");
      return;
    }
    setEditingEmail(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEditEmail = (email: any) => {
    setEditingEmail(email);
    form.reset({
      email: email.email,
      passKey: email.passKey,
      customPrompt: email.customPrompt || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEmail = async (emailId: number) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Email deleted successfully");
        loadEmails();
      } else {
        toast.error("Failed to delete email");
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Failed to delete email");
    }
  };

  const addEmail = async (data: z.infer<typeof AddEmailFormSchema>) => {
    try {
      const url = editingEmail
        ? `/api/emails/${editingEmail.id}`
        : "/api/emails";
      const method = editingEmail ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingEmail
            ? "Email updated successfully"
            : "Email added successfully"
        );
        setIsDialogOpen(false);
        form.reset();
        setEditingEmail(null);
        loadEmails();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save email");
      }
    } catch (error) {
      console.error("Error saving email:", error);
      toast.error("Failed to save email");
    }
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
                <div
                  className="h-8 w-8 flex items-center justify-center cursor-pointer"
                  onClick={handleAddEmailClick}
                >
                  <PlusIcon />
                </div>
              </SidebarGroupAction>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmail ? "Edit Email" : "Add Email"}
                </DialogTitle>
                <DialogDescription>
                  {editingEmail
                    ? "Edit your email account details."
                    : "Add a new email account to your profile."}
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
                    <Label htmlFor="customPrompt">
                      Custom Prompt (Optional)
                    </Label>
                    <Textarea
                      id="customPrompt"
                      {...form.register("customPrompt")}
                      placeholder="Enter custom prompt for this email"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingEmail(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingEmail ? "Update Email" : "Add Email"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <SidebarGroupContent className="group-data-[state=collapsed]:hidden"></SidebarGroupContent>
        </SidebarGroup>

        <Separator className="m-0 p-0" />
      </SidebarHeader>
      <SidebarContent>
        {isLoadingEmails ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-800 py-3 px-2 rounded-md">
                <div className="h-3 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div className="px-3 py-4 text-center text-muted-foreground text-sm">
            No emails added yet
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className="bg-zinc-800 mx-3 py-3 px-2 rounded-md flex flex-row justify-between items-center"
            >
              <div
                className={`text-[0.675rem] cursor-pointer hover:text-white transition-colors flex-1 ${
                  selectedEmail?.id === email.id
                    ? "border-l-2 border-blue-500 pl-2"
                    : ""
                }`}
                onClick={() => {
                  setSelectedEmail(email);
                  onEmailClick?.(email);
                }}
              >
                {email.email}
              </div>
              <Popover>
                <PopoverTrigger>
                  <MoreVertical className="text-zinc-700 w-4 h-4 hover:text-white transition-colors" />
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      className="text-xs w-full rounded-none"
                      onClick={() => handleEditEmail(email)}
                    >
                      Edit
                    </Button>
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
                           <AlertDialogTitle>Delete Email</AlertDialogTitle>
                           <AlertDialogDescription>
                             Are you sure you want to delete "{email.email}"? This action cannot be undone and will also delete all associated recipients.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction
                             onClick={() => handleDeleteEmail(email.id)}
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
            </div>
          ))
        )}
      </SidebarContent>
      <SidebarFooter className="mb-3">
        {isLoading ? (
          <Card className="p-3">
            <div className="flex flex-col">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-3 bg-muted animate-pulse rounded mt-1"></div>
            </div>
          </Card>
        ) : user ? (
          <Card
            className="p-3 cursor-pointer hover:bg-accent transition-colors"
            onClick={onProfileClick}
          >
            <div className="flex flex-col">
              <div>{user.name}</div>
              <div className="text-muted-foreground text-xs">Profile</div>
            </div>
          </Card>
        ) : (
          <Card
            className="p-3 cursor-pointer hover:bg-accent transition-colors"
            onClick={onProfileClick}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Create Profile</span>
              </div>
              <div className="text-muted-foreground text-xs">
                Add your details
              </div>
            </div>
          </Card>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
