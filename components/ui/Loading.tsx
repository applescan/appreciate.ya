import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-4">
      <Image
        height={150}
        width={150}
        src={"/loading.gif"}
        alt="loading..."
      ></Image>
      <p className="text-sm font-semibold text-[var(--color-muted)]">
        Loading...
      </p>
    </div>
  );
}
