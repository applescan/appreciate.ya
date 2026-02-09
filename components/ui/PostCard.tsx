import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { capitalizeEachWord, getInitials } from "@/helpers/helpers";
import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from "@/graphql/mutations";
import { Button } from "./Button";
import EditPostDialog from "../EditPostDialog";
import { CiClock2 } from "react-icons/ci";
import DeleteDialog from "../DeleteDialog";
import { useMutation } from "@apollo/client";
import { FaRegCommentDots } from "react-icons/fa6";
import { DELETE_POST } from "@/graphql/mutations";
import { Comment } from "../../lib/types/types";
import { useRouter } from "next/navigation";
import { Input } from "./Input";
import { IoSend } from "react-icons/io5";
import { render } from "@react-email/render";
import CommentEmail from "../CommentEmail";

type PostCardProps = {
  postId: number;
  authorName: string;
  authorImage: string;
  postImage: string;
  recipient: string;
  recipientEmail?: string;
  content: string;
  postTime: React.ReactNode;
  edit?: boolean;
  deletePost?: boolean;
  comment?: Comment[];
  currentUserId?: number;
  addComment?: boolean;
  refetch: () => void;
};

export default function PostCard({
  postId,
  authorName,
  authorImage,
  postImage,
  recipient,
  recipientEmail,
  content,
  postTime,
  edit = false,
  deletePost = false,
  comment,
  currentUserId,
  addComment = false,
  refetch,
}: PostCardProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deletePostMutation] = useMutation(DELETE_POST);

  const handleDelete = async () => {
    try {
      await deletePostMutation({ variables: { id: Number(postId) } });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const [newCommentContent, setNewCommentContent] = useState("");
  const [createCommentMutation] = useMutation(CREATE_COMMENT);
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  const router = useRouter();

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) return;

    try {
      const { data: commentData } = await createCommentMutation({
        variables: {
          content: newCommentContent,
          authorId: currentUserId,
          postId: Number(postId),
        },
      });

      const commentId = commentData.createComment.id;
      const emailLink = `https://appreciate-ya.vercel.app/post/${postId}`;
      const emailHtml = render(<CommentEmail links={ emailLink } />);

      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: "New comment on your post!",
          message: emailHtml,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setNewCommentContent("");
      refetch();
    } catch (error) {
      console.error("Error creating comment or sending email:", error);
    }
  };

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);

  const startEditing = (comment: Comment) => {
    setEditingCommentId(Number(comment.id));
    setEditingCommentContent(comment.content);
  };

  const handleEditComment = async () => {
    if (editingCommentId === null) return;
    await updateCommentMutation({
      variables: { id: editingCommentId, content: editingCommentContent },
    });
    setEditingCommentId(null);
    setEditingCommentContent("");
    refetch();
  };

  const initiateDeleteComment = (commentId: number) => {
    setDeletingCommentId(commentId);
    setIsDeleteCommentModalOpen(true);
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteCommentMutation({
      variables: { id: commentId },
    });
    refetch();
  };

  return (
    <div className="surface-card flex flex-col space-y-4 overflow-hidden rounded-3xl p-6 text-[var(--color-fg)]">
      <div className="flex space-x-4 items-center">
        <Avatar className="w-12 h-12">
          <AvatarImage src={ authorImage } />
          <AvatarFallback>
            { authorName ? getInitials(authorName) : "NA" }
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-semibold">
            { capitalizeEachWord(authorName) }
          </span>
          <span className="text-xs text-[var(--color-muted)] flex gap-1 items-center">
            <CiClock2 className="h-3 w-3" />
            { postTime }
          </span>
        </div>
      </div>
      <div>
        <img
          src={ postImage }
          alt={ recipient }
          height={ 100 }
          width={ 200 }
          className="object-cover w-full mb-4 rounded-2xl bg-slate-200"
        />
        <span className="text-lg font-semibold text-[var(--color-fg)]">
          { " " }
          To: { capitalizeEachWord(recipient) }
        </span>
        <p className="text-sm text-[var(--color-muted)] pt-2 pb-4">{ content }</p>
      </div>
      { comment && (
        <div
          className="text-[var(--color-muted)] hover:text-[var(--color-fg)] flex gap-2 pt-4 items-center border-t border-[var(--color-border)] justify-end underline underline-offset-2 decoration-1 cursor-pointer"
          onClick={ () => router.push(`/post/${postId}`) }
        >
          <FaRegCommentDots />
          { comment.length > 1
            ? `${comment.length} comments`
            : `${comment.length} comment` }
        </div>
      ) }
      <div
        className={ `${deletePost ? "flex items-center justify-between border-t border-[var(--color-border)] pt-6" : "hidden"}` }
      >
        <Button
          variant={ "outline" }
          onClick={ () => setIsDelete(true) }
          className={ `${deletePost ? "" : "hidden"}` }
        >
          Delete
        </Button>
        <Button
          variant={ "outline" }
          onClick={ () => setIsEdit(true) }
          className={ `${edit ? "px-4" : "hidden"}` }
        >
          Edit
        </Button>
      </div>
      <EditPostDialog
        isOpen={ isEdit }
        onOpenChange={ setIsEdit }
        postId={ postId }
        content={ content }
        selectedImage={ postImage }
      />
      <DeleteDialog
        isOpen={ isDelete }
        onOpenChange={ setIsDelete }
        handleSubmit={ handleDelete }
      />
      { addComment && (
        <>
          {/* Add Comment Section */ }
          <div className="flex items-center gap-2 justify-between">
            <>
              <Input
                type="text"
                value={ newCommentContent }
                onChange={ (e) => setNewCommentContent(e.target.value) }
                className="w-full"
                placeholder="Write a comment..."
              />
              <div className="text-[var(--color-accent)]" onClick={ handleAddComment }>
                <IoSend className="h-6 w-6" />
              </div>
            </>
          </div>
          { comment?.map((comment) => (
            <div key={ comment.id } className="flex flex-col w-full gap-1 pt-4">
              <div className="flex gap-2 items-center">
                {/* Always show the avatar */ }
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={ comment.author.image || "default-avatar-url" }
                  />
                  <AvatarFallback>
                    { getInitials(comment.author.name) }
                  </AvatarFallback>
                </Avatar>

                {/* Conditional rendering for editing mode */ }
                { editingCommentId === Number(comment.id) ? (
                  <div className="w-full border border-[var(--color-border)] bg-white/90 rounded-2xl py-2 px-4">
                    <p className="text-[var(--color-fg)] font-semibold text-sm">
                      { comment.author.name }
                    </p>
                    <Input
                      type="text"
                      value={ editingCommentContent }
                      className="w-full"
                      onChange={ (e) => setEditingCommentContent(e.target.value) }
                    />
                  </div>
                ) : (
                  <div className="py-2 px-4 w-full bg-white/80 rounded-2xl border border-[var(--color-border)]">
                    <p className="text-[var(--color-fg)] font-semibold text-sm">
                      { comment.author.name }
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      { comment.content }
                    </p>
                  </div>
                ) }
              </div>

              {/* Edit and Delete buttons */ }
              { Number(comment.author.id) === currentUserId &&
                editingCommentId !== Number(comment.id) && (
                  <div className="flex gap-2 justify-end pt-2">
                  <div
                    className="text-xs text-[var(--color-muted)] py-2 cursor-pointer"
                    onClick={ () => startEditing(comment) }
                  >
                    Edit
                  </div>
                  <div
                    className="text-xs text-[var(--color-muted)] py-2 cursor-pointer"
                    onClick={ () => initiateDeleteComment(Number(comment.id)) }
                  >
                    Delete
                  </div>
                </div>
              ) }

              {/* Save and Cancel buttons for editing mode */ }
              { editingCommentId === Number(comment.id) && (
                <div className="flex gap-2 justify-end pt-2 items-center">
                  <div
                    className="text-xs text-[var(--color-muted)] py-2 cursor-pointer"
                    onClick={ () => setEditingCommentId(null) }
                  >
                    Cancel
                  </div>
                  <Button variant={ "ghost" } onClick={ handleEditComment }>
                    <IoSend className="h-6 w-6 text-[var(--color-accent)]" />
                  </Button>
                </div>
              ) }
            </div>
          )) }

          <DeleteDialog
            isOpen={ isDeleteCommentModalOpen }
            onOpenChange={ setIsDeleteCommentModalOpen }
            handleSubmit={ () => {
              if (deletingCommentId !== null) {
                handleDeleteComment(deletingCommentId);
                setDeletingCommentId(null);
              }
              setIsDeleteCommentModalOpen(false);
            } }
          />
        </>
      ) }{ " " }
    </div>
  );
}
