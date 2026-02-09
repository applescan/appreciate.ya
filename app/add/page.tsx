"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { GET_USERS } from "@/graphql/queries";
import CreatePostDialog from "@/components/CreatePostDialog";

const imageOptions = Array.from(
  { length: 30 },
  (_, i) => `/giftCards/${i + 1}.png`,
);

export default function page() {
  const [selectedImage, setSelectedImage] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const orgId = sessionData?.user.orgId;
  const { data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data) {
      setUserOptions(data.users);
    }
  }, [data]);

  const openDialog = (image: string) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {imageOptions.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Card ${index + 1}`}
            className="w-full cursor-pointer rounded-3xl border border-transparent shadow-md transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[var(--color-border)]"
            onClick={() => openDialog(image)}
          />
        ))}
      </div>
      <CreatePostDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recipientId={recipientId}
        setRecipientId={setRecipientId}
        selectedImage={selectedImage}
        content={content}
        setContent={setContent}
        authorId={user?.id ?? ""}
        orgId={orgId}
        filter={"MONTH"}
      />
    </div>
  );
}
