"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import { NotebookText } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

const WelcomeBanner: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="p-5 bg-secondary text-white rounded-lg flex items-center gap-6">
      <div>
        <h2 className="font-bold text-3xl md:text-xl sm:text-sm">
          Hello, {user?.fullName}
        </h2>
        <p>Welcome Back, It's time to get back and start learning a new topic.</p>
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

export default WelcomeBanner;
