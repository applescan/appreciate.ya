"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    container?: HTMLElement | null;
    isDynamic?: boolean;
  }
>(
  (
    {
      className,
      align = "start",
      sideOffset = 0,
      container,
      isDynamic,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        style={{
          width: isDynamic ? undefined : "var(--radix-popover-trigger-width)",
          maxHeight: "400px",
        }}
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-auto rounded-2xl border border-[var(--color-border)] bg-white/95 text-[var(--color-fg)] shadow-xl outline-none backdrop-blur-sm",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
