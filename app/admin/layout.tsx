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
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === Status.LOADING) {
    return <Loading />;
  }

  if (sessionData?.user.role !== "ADMIN" || status === Status.UNAUTHENTICATED) {
    router.push("/");
  }

  const getDefaultTab = () => {
    if (pathname?.endsWith("/users")) {
      return "users";
    } else if (pathname?.endsWith("/organisations")) {
      return "organisations";
    } else {
      return "users";
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 lg:px-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Admin
        </p>
        <h2 className="text-3xl font-semibold text-[var(--color-fg)] sm:text-4xl">
          User management
        </h2>
      </div>
      <div className="flex justify-center">
        <Tabs
          defaultValue={getDefaultTab()}
          className="w-full flex justify-center"
        >
          <TabsList>
            <TabsTrigger
              value="users"
              onClick={() => router.push("/admin/users")}
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="organisations"
              onClick={() => router.push("/admin/organisations")}
            >
              Organisations
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <main>
        {React.cloneElement(children as React.ReactElement, { sessionData })}
      </main>
    </div>
  );
};

export default Layout;
