"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AuthRedirect = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setOpen(true);
    }
  }, [isLoaded, isSignedIn]);

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  if (isLoaded && isSignedIn) {
    return (
      <>
        <div className="hidden">{children}</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Already Signed In</DialogTitle>
              <DialogDescription>
                You are already logged into your account. Would you like to go to your dashboard?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleRedirect} variant="primary">
                Go to Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <>{children}</>;
};

export default AuthRedirect;
