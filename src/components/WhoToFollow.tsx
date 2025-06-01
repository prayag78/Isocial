'use client';

import { useEffect, useState } from "react";
import { getRandomUsers } from "@/actions/user"; // make sure it's safe on client side
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";


type RandomUser = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  _count: {
    followers: number;
  };
};


function WhoToFollow() {
  const [users, setUsers] = useState<RandomUser[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getRandomUsers(); // make this a public API route or client-safe
      setUsers(data);
    }
    fetchUsers();
  }, []);

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex gap-2 items-center justify-between ">
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">{user._count.followers} followers</p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WhoToFollow;
