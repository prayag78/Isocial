"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    console.error("Error syncing user", error);
    return null;
  }
}

export async function getUser(clerkId: string) {
  try {
    return prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
            posts: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
}
