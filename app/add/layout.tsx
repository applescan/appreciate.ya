"use client";
import React, { ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { Status } from "@/lib/types/types";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === Status.LOADING) {
    return <Loading />;
  }

  if (status === Status.UNAUTHENTICATED) {
    signIn();
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 lg:px-10">
      <div className="flex flex-col gap-3">
        <button
          className="flex items-center gap-3 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-fg)]"
          onClick={() => router.push("/dashboard")}
        >
          <FaArrowLeft className="text-[var(--color-accent)]" /> Back to
          dashboard
        </button>
        <h2 className="text-3xl font-semibold text-[var(--color-fg)]">
          Choose a card that fits the moment
        </h2>
        <p className="max-w-2xl text-sm text-[var(--color-muted)]">
          Pick a design, then add a message that feels thoughtful and genuine.
        </p>
      </div>
      <main>
        {React.cloneElement(children as React.ReactElement, { sessionData })}
      </main>
    </div>
  );
};

export default Layout;
