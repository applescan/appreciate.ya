"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_POSTS_BY_SPECIFIC_RECIPIENT,
  GET_USERS_BY_ORGANIZATION_ID,
} from "@/graphql/queries";
import PostCard from "@/components/ui/PostCard";
import { Post, User } from "@/lib/types/types";
import Loading from "@/components/ui/Loading";
import {
  capitalizeEachWord,
  formatTime,
  topFansCount,
} from "@/helpers/helpers";
import { useSession } from "next-auth/react";
import FilterDropdown from "@/components/FilterDropdown";
import ErrorPage from "@/components/ui/Error";
import { Card } from "@/components/ui/Card";

const UserPostPage = () => {
  const { data: sessionData } = useSession();
  const currentOrgId = parseInt(sessionData?.user?.orgId);
  const currentUserId = parseInt(sessionData?.user?.id);
  const [selectedFilter, setSelectedFilter] = useState("YEAR");

  const { data: usersData, error: usersError } = useQuery<{
    usersByOrganizationId: User[];
  }>(GET_USERS_BY_ORGANIZATION_ID, {
    variables: { orgId: currentOrgId },
  });

  const { loading, error, data, refetch } = useQuery(
    GET_POSTS_BY_SPECIFIC_RECIPIENT,
    {
      variables: {
        orgId: currentOrgId,
        recipientId: currentUserId,
        filter: { type: selectedFilter },
      },
    },
  );

  function extractImageUrlFromContent(content: string) {
    // Regular expression to match Markdown image syntax
    const regex = /!\[.*?\]\((.*?)\)/;
    const matches = content.match(regex);

    // If matches found, return the first captured group, which is the URL
    if (matches && matches[1]) {
      return matches[1];
    }

    // If no matches, return a default image or an empty string
    return "";
  }

  function removeImageUrlFromContent(content: string) {
    // Regular expression to match Markdown image syntax
    const regex = /!\[.*?\]\(.*?\)/g;
    return content.replace(regex, "").trim();
  }

  if (loading || !data) return <Loading />;
  if (error || usersError) return <ErrorPage />;

  const handleFilterSelect = (value: string) => {
    const filterType = value;
    setSelectedFilter(filterType);
    refetch({ orgId: currentOrgId, filter: { type: filterType } });
  };

  const authorNames = data.postsBySpecificRecipient.map(
    (post: { author: { name: string } }) => post.author.name,
  );

  const topMVP = topFansCount(authorNames);

  return (
    <>
      <div className="pb-5 flex justify-center md:justify-end">
        <div className="flex min-w-fit items-center gap-2">
          <span className="text-[var(--color-muted)] font-medium text-sm min-w-[55px]">
            Filter by
          </span>
          <div className="w-[150px]">
            <FilterDropdown
              handleFilterSelect={handleFilterSelect}
              selectedFilter={selectedFilter}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        <Card className="mt-2 px-6 mb-6 w-full h-full flex items-center gap-6 justify-center">
          <div>
            {" "}
            <img
              src="/fan.png"
              alt="mvp logo"
              height={100}
              width={100}
            ></img>{" "}
          </div>
          <div className="flex gap-2 flex-col pr-6">
            <h2 className="text-base font-semibold text-[var(--color-fg)]">
              Your top fan this {selectedFilter.toLocaleLowerCase()}
            </h2>
            <div className="p-0">
              {topMVP.length > 0 ? (
                topMVP.map((name) => (
                  <p className="text-2xl font-semibold text-[var(--color-fg)]">
                    {capitalizeEachWord(name)}
                  </p>
                ))
              ) : (
                <p className="text-2xl font-semibold text-[var(--color-fg)]">
                  Unknown
                </p>
              )}
            </div>
          </div>
        </Card>
        <Card className="mt-2 px-6 mb-6 w-full h-full flex items-center gap-6 justify-center">
          <div>
            {" "}
            <img
              src="/received.png"
              alt="kudos logo"
              height={100}
              width={100}
            ></img>{" "}
          </div>
          <div className="flex gap-2 flex-col pr-6">
            <h2 className="text-base font-semibold text-[var(--color-fg)]">
              Total kudos received
            </h2>
            <p className="text-2xl font-semibold text-[var(--color-fg)]">
              {data.postsBySpecificRecipient.length}
            </p>
          </div>
        </Card>
        <Card className="mt-2 px-6 mb-6 w-full h-full flex items-center gap-6 justify-center">
          <div>
            {" "}
            <img
              src="/team.png"
              alt="team logo"
              height={100}
              width={100}
            ></img>{" "}
          </div>
          <div className="flex gap-2 flex-col pr-6">
            <h2 className="text-base font-semibold text-[var(--color-fg)] flex justify-start">
              My Team
            </h2>
            <p className="text-2xl font-semibold text-[var(--color-fg)]">
              {usersData?.usersByOrganizationId.length} people
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.postsBySpecificRecipient &&
          data.postsBySpecificRecipient.map((post: Post) => (
            <PostCard
              key={post.id}
              postId={Number(post.id)}
              authorName={post.author.name}
              authorImage={post.author.image || "default-avatar-url"}
              postImage={extractImageUrlFromContent(post.content)}
              recipient={post.recipient.name}
              comment={post.comments}
              content={removeImageUrlFromContent(post.content)}
              postTime={formatTime(post.createdAt)}
              refetch={refetch}
            />
          ))}
      </div>
      {data.postsBySpecificRecipient.length === 0 && (
        <div className="flex justify-center w-full py-10 h-56 my-auto item">
          <p className="font-semibold text-[var(--color-muted)] flex justify-center items-center">
            It&apos;s empty in here, don&apos;t worry, it will fill up soon!
          </p>
        </div>
      )}
    </>
  );
};

export default UserPostPage;
