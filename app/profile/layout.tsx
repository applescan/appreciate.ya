"use client";
import React, { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/components/ui/Loading";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 lg:px-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Profile
        </p>
        <h2 className="text-3xl font-semibold text-[var(--color-fg)] sm:text-4xl">
          Keep your details up to date
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Update your account information and preferences.
        </p>
      </div>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
