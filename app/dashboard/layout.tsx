"use client";
import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
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
    router.push("/");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 lg:px-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Dashboard
        </p>
      </div>

      <main>
        { React.cloneElement(children as React.ReactElement, { sessionData }) }
      </main>
    </div>
  );
};

export default Layout;
