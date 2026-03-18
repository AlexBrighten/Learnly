"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

import { NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "../../../components/ui/button";

export const UnitBanner: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-green-500 p-5 text-white">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-bold">{user?.fullName}</h3>
        <p className="text-lg">Welcome Back, It's time to get back and start learning a new topic.</p>
      </div>

      <Link href="/lesson">
        <Button
          size="lg"
          variant="secondary"
          className="hidden border-2 border-b-4 active:border-b-2 xl:flex"
        >
          <NotebookText className="mr-2" />
          Continue
        </Button>
      </Link>
    </div>
  );
};
