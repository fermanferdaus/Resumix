import { cn } from "../../lib/utils.js";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-[#e2e8f0]", className)}
      {...props}
    />
  );
}

