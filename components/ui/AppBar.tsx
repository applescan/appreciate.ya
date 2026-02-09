"use client";

import React, { useState } from "react";
import SigninButton from "../SigninButton";
import { FaBars } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { Dialog, Popover } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { capitalizeEachWord, getInitials } from "@/helpers/helpers";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import { Status } from "@/lib/types/types";

const AppBar = () => {
  const { data: sessionData, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { id: userId, image } = sessionData?.user || {};
  const router = useRouter();
  const { data: userData } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });
  const profileImg = userData?.user?.image || image;

  return (
    <>
      <header className={`sticky top-0 ${mobileMenuOpen ? "z-30" : "z-50"}`}>
        <nav
          className="glass-panel mx-4 mt-4 flex items-center justify-between rounded-full px-6 py-4 lg:mx-8 lg:px-10"
          aria-label="Global"
        >
          <div className="flex items-center gap-3">
            {status === Status.AUTHENTICATED ? (
              <div
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer transition-transform transform hover:scale-105"
              >
                <Image
                  src="/logo.png"
                  width={130}
                  height={80}
                  alt="Appreciate ya logo"
                />
              </div>
            ) : (
              <div onClick={() => router.push("/")} className="cursor-pointer">
                <Image
                  src="/logo.png"
                  width={130}
                  height={80}
                  alt="Appreciate ya logo"
                />
              </div>
            )}
            <span className="hidden text-sm font-semibold tracking-wide text-[var(--color-muted)] lg:inline">
              Celebrate wins, every day.
            </span>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-[var(--color-fg)] hover:bg-white/70 transition"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-3 items-center">
            {status === Status.AUTHENTICATED && (
              <div
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-fg)] hover:bg-white/70 transition"
              >
                Dashboard
              </div>
            )}
            {sessionData?.user?.role === "ADMIN" &&
              status === Status.AUTHENTICATED && (
                <div
                  onClick={() => router.push("/admin/users")}
                  className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-fg)] hover:bg-white/70 transition"
                >
                  User Management
                </div>
              )}
            {status === Status.AUTHENTICATED && (
              <div
                onClick={() => router.push("/mykudos/received")}
                className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-fg)] hover:bg-white/70 transition"
              >
                My Kudos
              </div>
            )}
            <SigninButton />
          </Popover.Group>
        </nav>

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-[50] bg-black/30" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-[60] w-3/4 bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-xl rounded-l-2xl">
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="-m-2.5 rounded-full p-2.5 text-[var(--color-fg)] hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <MdClose className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div>
              <div className="pb-2">
                {status === Status.AUTHENTICATED && (
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <button
                      className="flex items-center gap-3 rounded-full p-2 hover:bg-gray-100"
                      onClick={() => router.push("/profile")}
                    >
                      <Avatar>
                        <AvatarImage src={profileImg} />
                        <AvatarFallback>
                          {sessionData?.user.name
                            ? getInitials(sessionData?.user.name)
                            : "NA"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-[var(--color-fg)] font-semibold">
                        {capitalizeEachWord(sessionData?.user.name)}
                      </p>
                    </button>
                    <hr />
                  </div>
                )}
              </div>

              <div className="flex flex-col pt-2">
                {status === Status.AUTHENTICATED && (
                  <p
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer block rounded-full px-3 py-2 text-base font-normal leading-7 text-[var(--color-fg)] hover:bg-gray-50"
                  >
                    Dashboard
                  </p>
                )}
                {sessionData?.user?.role === "ADMIN" &&
                  status === Status.AUTHENTICATED && (
                    <div
                      onClick={() => router.push("/admin/users")}
                      className="cursor-pointer"
                    >
                      <p className="block rounded-full px-3 py-2 text-base font-normal leading-7 text-[var(--color-fg)] hover:bg-gray-50">
                        User Management
                      </p>
                    </div>
                  )}
                {status === Status.AUTHENTICATED && (
                  <div
                    onClick={() => router.push("/mykudos/received")}
                    className="cursor-pointer"
                  >
                    <p className="block rounded-full px-3 py-2 text-base font-normal leading-7 text-[var(--color-fg)] hover:bg-gray-50">
                      My Kudos
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              {status === Status.AUTHENTICATED ? (
                <div className="absolute bottom-0 mr-6 mb-6">
                  <button
                    onClick={() => signOut()}
                    className="text-red-600 text-left font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="absolute top-0 mr-6 mt-6">
                  <button
                    onClick={() => signIn()}
                    className="text-green-600 ml-auto font-semibold cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
};

export default AppBar;
