export const dynamic = "force-dynamic";

import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

// export async function generateMetadata({
//   params,
// }: {
//   params: { username: string };
// }) {
//   const user = await getProfileByUsername(params.username);
//   if (!user) return;

//   return {
//     title: `${user.name ?? user.username}`,
//     description: user.bio || `Check out ${user.username}'s profile.`,
//   };
// }

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
  const { username } = await params;
  const user = await getProfileByUsername(username);

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
