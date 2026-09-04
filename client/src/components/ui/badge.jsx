import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-none border transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#af101a] text-white border-transparent",
        secondary:
          "bg-[#f1f5f9] text-[#1a1b22] border-[#e2e8f0]",
        destructive:
          "bg-[#ba1a1a] text-white border-transparent",
        outline:
          "text-[#1a1b22] border-[#e2e8f0] bg-white",
        success:
          "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
        warning:
          "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
        admin:
          "bg-[#fef2f2] text-[#af101a] border-[#fecaca] font-bold",
        info:
          "bg-[#f8fafc] text-[#0f172a] border-[#cbd5e1]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
