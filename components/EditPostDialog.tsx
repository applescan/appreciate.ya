"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_POST } from "@/graphql/mutations";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { capitalizeEachWord } from "@/helpers/helpers";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  postId: number;
  content: string;
  selectedImage: string;
}

const EditPostDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onOpenChange,
  postId,
  content,
  selectedImage,
}) => {
  const [editPostMutation] = useMutation(UPDATE_POST);

  const [editPostData, setEditPostData] = useState<{
    id: number;
    content: string;
  }>({
    id: postId,
    content: content,
  });

  const mutationVariables = useMemo(
    () => ({
      id: Number(postId),
      content: editPostData.content + `\n![image](${selectedImage})`,
    }),
    [postId, editPostData],
  );

  const handleEditUser = async () => {
    try {
      await editPostMutation({ variables: mutationVariables });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setEditPostData({
      id: postId,
      content: content,
    });
  }, [postId, content]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit Message</DialogTitle>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUser();
            }}
          >
            <img
              src={selectedImage}
              height={100}
              width={200}
              className="object-cover w-full mb-4 rounded-2xl bg-slate-200"
            />

            {/* Name field */}
            <div className="mt-4">
              <label htmlFor="editPost" className="text-sm font-semibold">
                Message
              </label>
              <textarea
                id="editPost"
                value={editPostData.content}
                onChange={(event) => {
                  const { value } = event.target;
                  setEditPostData((prev) => ({ ...prev, content: value }));
                }}
                className="mt-2 block w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-3 py-2 text-sm text-[var(--color-fg)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-6 flex justify-between">
              <div className="flex items-center gap-2">
                <Button onClick={() => onOpenChange(false)} variant={"outline"}>
                  Cancel
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit">Update Message</Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
