"use server";

import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user";
import { prisma } from "@/lib/prisma";



export async function createPost(content: string, imageUrl: string){
    try{
        const userId = await getDbUserId();
        if (!userId) return;

        const post = await prisma.post.create({
            data:{
                content,
                image: imageUrl,
                authorId: userId,
            }
        })

        revalidatePath("/"); // purge the cache for the home page
        return { success: true, post };

    }catch(error){
        console.log(error);
        return {error: "Failed to create post"}
    }
}