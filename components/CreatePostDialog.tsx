import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST } from "@/graphql/mutations";
import {
  GET_ALL_POSTS_BY_ORG,
  GET_USERS_BY_ORGANIZATION_ID,
} from "@/graphql/queries";
import { User } from "@/lib/types/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/Dropdown";
import PostSuccessDialog from "./PostSuccessDialog";
import { Skeleton } from "./ui/Skeleton";
import { render } from "@react-email/render";
import { PostEmail } from "./PostEmail";
import { IoSend } from "react-icons/io5";
import { MdCopyAll } from "react-icons/md";

type CreatePostDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  recipientId: string;
  setRecipientId: (recipientId: string) => void;
  selectedImage: string;
  content: string;
  setContent: (content: string) => void;
  authorId: string;
  orgId: string;
  filter: string;
};

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  onOpenChange,
  recipientId,
  setRecipientId,
  selectedImage,
  content,
  setContent,
  authorId,
  orgId,
  filter,
}) => {
  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_ALL_POSTS_BY_ORG,
        variables: { orgId: orgId, filter: { type: filter } },
      },
    ],
  });
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<{ usersByOrganizationId: User[] }>(
    GET_USERS_BY_ORGANIZATION_ID,
    {
      variables: { orgId: parseInt(orgId) },
    },
  );
  const [selectedRecipient, setSelectedRecipient] = useState({
    id: "",
    name: "",
    recipientEmail: "",
  });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isAIChatActive, setIsAIChatActive] = useState(false);
  const [aiChatInput, setAIChatInput] = useState("");
  const [aiChatResponse, setAIChatResponse] = useState("");

  const handleRecipientSelect = (
    userId: string,
    userName: string,
    email: string,
  ) => {
    setRecipientId(userId);
    setSelectedRecipient({ id: userId, name: userName, recipientEmail: email });
  };

  const resetForm = () => {
    setRecipientId("");
    setSelectedRecipient({ id: "", name: "", recipientEmail: "" });
    setContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage && recipientId && content) {
      try {
        const { data: postData } = await createPost({
          variables: {
            content: content + `\n![image](${selectedImage})`,
            authorId: parseInt(authorId),
            orgId: parseInt(orgId),
            recipientId: parseInt(recipientId),
          },
        });

        const newPostId = postData.createPost.id;
        const emailLink = `https://appreciate-ya.vercel.app/post/${newPostId}`;
        const emailHtml = render(<PostEmail links={ emailLink } />);

        const response = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: selectedRecipient.recipientEmail,
            subject: "You have received a new kudos!",
            message: emailHtml,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }

        resetForm();
        setIsSuccessDialogOpen(true);
      } catch (error) {
        console.error(error);
        alert("Failed to create post");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleAIChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) {
      alert("Please enter a question for the AI.");
      return;
    }

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: aiChatInput + "in 3 sentences or less" },
        ],
      }),
    })
      .then(async (response) => {
        if (!response.body) {
          throw new Error("Failed to get a response body");
        }
        const reader = response.body.getReader();
        setAIChatResponse("");

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break; // Exit the loop when the stream is finished
          }

          // Decode the stream chunk to a string and update the response state
          var currentChunk = new TextDecoder().decode(value);
          setAIChatResponse((prev) => prev + currentChunk);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch AI chat response:", error);
        setAIChatResponse("Failed to communicate with AI.");
      });
    setAIChatInput("");
  };

  const toggleAIChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsAIChatActive(!isAIChatActive);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
      setIsAIChatActive(isAIChatActive);
      setIsAIChatActive(false);
      setAIChatResponse("");
    }
    onOpenChange(isOpen);
  };

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    onOpenChange(false);
  };

  const handleCopyToClipboard = (
    text: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("AI response copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
        alert("Failed to copy text.");
      });
  };

  return (
    <>
      <Dialog open={ isOpen } onOpenChange={ handleClose }>
        <DialogContent className="h-5/6">
          <DialogHeader>
            <DialogTitle>What do you want to say?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center overflow-auto">
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <img
                  src={ selectedImage }
                  alt="Selected"
                  className="w-full rounded-2xl shadow-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="recipient"
                  className="block text-sm font-semibold text-[var(--color-fg)]"
                >
                  Select Recipient:
                </label>
                { usersData ? (
                  <Select
                    onValueChange={ (value) => {
                      const user = usersData.usersByOrganizationId.find(
                        (user) => user.id === value,
                      );
                      if (user) {
                        handleRecipientSelect(user.id, user.name, user.email);
                      }
                    } }
                  >
                    <SelectTrigger aria-label="Recipient">
                      <SelectValue placeholder="Select Recipient">
                        { selectedRecipient.name }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        { usersData.usersByOrganizationId.map((user) => (
                          <SelectItem key={ user.id } value={ user.id }>
                            { user.name }
                          </SelectItem>
                        )) }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : usersLoading ? (
                  <Skeleton />
                ) : usersError ? (
                  <div>Error: { usersError.message }</div>
                ) : null }
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-semibold text-[var(--color-fg)]"
                >
                  Content:
                </label>
                <textarea
                  id="content"
                  value={ content }
                  onChange={ (e) => setContent(e.target.value) }
                  className="mt-2 block w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-3 py-2 text-sm text-[var(--color-fg)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  placeholder="Give a shout-out, express thanks, or cheer on a teammate! Your kudos make a difference."
                />
              </div>

              {/* AI Chat Interface */ }
              { isAIChatActive && (
                <div className="my-4">
                  <form
                    onSubmit={ handleAIChatSubmit }
                    className="flex flex-col gap-2"
                  >
                    <label
                      htmlFor="content"
                      className="block text-sm font-semibold text-[var(--color-fg)]"
                    >
                      Ask AI for a suggestion:
                    </label>
                    <div className="flex items-center gap-2 justify-between">
                      <textarea
                        value={ aiChatInput }
                        onChange={ (e) => setAIChatInput(e.target.value) }
                        placeholder="Ask the AI something..."
                        className="block w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-3 py-2 text-sm text-[var(--color-fg)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                      />
                      <div
                        className="text-[var(--color-accent)]"
                        onClick={ (e) => handleAIChatSubmit(e) }
                      >
                        <IoSend className="h-6 w-6" />
                      </div>
                    </div>
                  </form>
                  { aiChatResponse && (
                    <div className="mt-4">
                      <label
                        htmlFor="aiResponse"
                        className="block text-sm font-semibold text-[var(--color-fg)]"
                      >
                        AI Response:
                      </label>
                      <div className="flex items-center space-x-2 mt-1 justify-between text-sm">
                        { aiChatResponse }
                        <Button
                          onClick={ (e) =>
                            handleCopyToClipboard(aiChatResponse, e)
                          }
                          variant={ "ghost" }
                        >
                          <p className="flex items-center gap-1 text-xs text-[var(--color-accent)]">
                            { " " }
                            <MdCopyAll />
                            Copy
                          </p>
                        </Button>
                      </div>
                    </div>
                  ) }
                </div>
              ) }

              <div className="flex justify-between pt-2">
                <Button onClick={ toggleAIChat } type="button" variant={ "ghost" }>
                  <div className="flex items-center gap-2">
                    <img src="robot.png" alt="AI chat" width="35" height="35" />
                    { isAIChatActive ? "Close AI Chat" : "Need suggestion?" }
                  </div>
                </Button>
                <Button type="submit">Create Post</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */ }
      <PostSuccessDialog
        isOpen={ isSuccessDialogOpen }
        onOpenChange={ handleSuccessDialogClose }
      />
    </>
  );
};

export default CreatePostDialog;
