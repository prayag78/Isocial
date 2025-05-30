import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { prisma } from "@/lib/prisma";

async function page() {
  
  return (
    <div>
      <p>hello world</p>
    </div>
  );
};

export default page;
