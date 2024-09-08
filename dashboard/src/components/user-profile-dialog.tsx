"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { encrypt } from "@/utils/litFunctions";

interface UserProfileDialogProps {
  triggerButton: ReactNode;
}

export function UserProfileDialog({ triggerButton }: UserProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customInstructions, setCustomInstructions] = useState(
    `Try to be consise and provide as much information as possible to help our agents assist you better.`
  );

  const [details, setDetails] = useState(
    `I am a software engineer with 5 years of experience in building web applications. I am new to crypto and want to learn more about it. I am interested in building decentralized applications and would like to learn more.`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const detailsString = `details about user: ${details}, custom instructions: ${customInstructions}`;

      await encrypt(detailsString);

      console.log("Submitted:", { customInstructions, details });
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-md">
        <DialogHeader>
          <DialogTitle>Custom Instructions</DialogTitle>
          <DialogDescription>
            Provide information about yourself to help our agents assist you
            better.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Custom Instructions
              </Label>
              <Textarea
                id="name"
                value={customInstructions}
                placeholder="Provide custom instructions that will help our agents assist you better"
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">
                About You
              </Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide details about yourself"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
