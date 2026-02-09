"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_POST_BY_ID } from "@/graphql/queries";
import PostCard from "@/components/ui/PostCard";
import Loading from "@/components/ui/Loading";
import ErrorPage from "@/components/ui/Error";
import {
  extractImageUrlFromContent,
  formatTime,
  removeImageUrlFromContent,
} from "@/helpers/helpers";
import { useSession } from "next-auth/react";

export default function Page() {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const id = pathname?.split("/").pop();
  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id: Number(id) },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;

  const post = data?.postById;

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-12 lg:px-10">
      <div className="w-full max-w-xl flex my-auto">
        {post ? (
          <PostCard
            postId={post.id}
            authorName={post.author?.name}
            authorImage={post.author?.image || "default-author-image-url"}
            postImage={extractImageUrlFromContent(post.content)}
            recipient={post.recipient?.name}
            recipientEmail={post.recipient?.email}
            content={removeImageUrlFromContent(post.content)}
            postTime={formatTime(post.createdAt)}
            comment={post.comments}
            currentUserId={sessionData?.user.id}
            addComment={true}
            refetch={refetch}
          />
        ) : (
          <p>No post found</p>
        )}
      </div>
    </div>
  );
}
