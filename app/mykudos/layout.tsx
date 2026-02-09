"use client";
import React, { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { Status } from "@/lib/types/types";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === Status.LOADING) {
    return <Loading />;
  }

  if (status === Status.UNAUTHENTICATED) {
    router.push("/");
  }

  const getDefaultTab = () => {
    if (pathname?.endsWith("/received")) {
      return "received";
    } else if (pathname?.endsWith("/sent")) {
      return "sent";
    } else {
      return "sent";
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 lg:px-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          My kudos
        </p>
        <h2 className="text-3xl font-semibold text-[var(--color-fg)] sm:text-4xl">
          Track the appreciation you&apos;ve shared
        </h2>
      </div>
      <div className="flex justify-center">
        <Tabs
          defaultValue={getDefaultTab()}
          className="w-full flex justify-center"
        >
          <TabsList>
            <TabsTrigger
              value="received"
              onClick={() => router.push("/mykudos/received")}
            >
              Received
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              onClick={() => router.push("/mykudos/sent")}
            >
              Sent
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
