"use client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-12 lg:flex-row lg:px-10">
      <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Oops
        </p>
        <h2 className="text-4xl font-semibold text-[var(--color-fg)] sm:text-5xl">
          Something went off-script.
        </h2>
        <p className="max-w-md text-sm text-[var(--color-muted)]">
          We couldn&apos;t load this view. Let&apos;s get you back to the
          workspace.
        </p>
        <Button onClick={() => router.push("/")} className="text-md">
          Return Home
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <img
          src={"/error.png"}
          alt={"error"}
          height={300}
          width={500}
          className="w-full max-w-md rounded-3xl object-cover shadow-xl"
        />
      </div>
    </div>
  );
}
