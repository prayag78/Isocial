"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUser(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}

export async function getRandomUsers(){
  try{
    const userId = await getDbUserId();
    if (!userId) return [];

    const randomUsers = await prisma.user.findMany({
      where:{
        AND:[
          {NOT : {id: userId}},
          {NOT:{
            followers:{
              some:{
                followerId: userId,
              }

            }
          }},
        ]
      },
      select:{
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;

  }catch(error){
    console.log("Error fetching random users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string){
  try{
    const userId = await getDbUserId();
    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if(existingFollow){
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    }else{
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // user being followed
            creatorId: userId, // user following
          },
        }),
      ])
      
    }

    revalidatePath("/");
    return {success : true}

  }catch(error){
    console.log("Error toggling follow", error);
    return {error: "Failed to toggle follow"};
  }
}
