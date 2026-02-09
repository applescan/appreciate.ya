import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-slate-200/70 via-slate-100 to-slate-200/70",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
