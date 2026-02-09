"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { capitalizeEachWord, getInitials } from "@/helpers/helpers";
import { useQuery } from "@apollo/client";
import { GET_ORG_NAME_BY_IDS } from "@/graphql/queries";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Skeleton } from "./ui/Skeleton";
import { useRouter } from "next/navigation";
import { Status } from "@/lib/types/types";

const SigninButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { orgId, id: userId, image } = session?.user || {};

  const { data: orgData, loading } = useQuery(GET_ORG_NAME_BY_IDS, {
    skip: !orgId,
    variables: { id: orgId },
  });

  const orgName = orgData?.organization?.name || "No Organisation data";

  const { data: userData } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  const profileImg = userData?.user?.image || image;

  if (status === Status.LOADING) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[60px]" />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[60px]" />
        </div>
      </div>
    );
  }

  if (session && session.user) {
    return (
      <>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-white/70 transition">
              <Avatar>
                <AvatarImage src={profileImg} />
                <AvatarFallback>
                  {session.user.name ? getInitials(session.user.name) : "NA"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-[var(--color-fg)]">
                {capitalizeEachWord(session.user.name)}
              </p>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56 flex flex-col text-left">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => router.push("/profile")}
                className="rounded-md px-2 py-1 text-left text-sm font-medium text-[var(--color-fg)] hover:bg-gray-50"
              >
                Profile
              </button>
              <button
                onClick={() => signOut()}
                className="rounded-md px-2 py-1 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
            <div className="flex items-center pt-2">
              <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                <HiOutlineOfficeBuilding /> {orgName}
              </span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="ml-auto rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-fg)] shadow-sm ring-1 ring-[var(--color-border)] hover:-translate-y-0.5 hover:shadow-md transition"
    >
      Sign In
    </button>
  );
};

export default SigninButton;
