import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PostSuccessDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const PostSuccessDialog: React.FC<PostSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95">
        <DialogHeader>
          <DialogTitle>Kudos sent successfully</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-[var(--color-muted)]">
          Your appreciation message is on its way. Thanks for recognizing your
          teammate&apos;s impact.
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/success.gif"
            alt={"success"}
            width={400}
            height={200}
          ></Image>
        </div>
        <div className="text-sm text-[var(--color-muted)]">
          A little gratitude goes a long way.
        </div>
        <div className="flex justify-end">
          <Button
            className="flex justify-center"
            variant="default"
            onClick={() => router.push("/dashboard")}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostSuccessDialog;
