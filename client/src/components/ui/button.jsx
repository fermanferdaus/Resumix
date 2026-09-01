import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium text-sm rounded-none transition-colors duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#af101a] text-white hover:bg-[#8f0d15] active:bg-[#6b080e] border border-transparent font-semibold",
        outline:
          "bg-white text-[#1a1b22] border border-[#1a1c1e] hover:bg-[#f8fafc] hover:border-[#af101a] active:bg-[#f1f5f9]",
        subtle:
          "bg-[#f8fafc] text-[#1a1b22] border border-[#e2e8f0] hover:border-[#1a1c1e] hover:bg-white",
        ghost:
          "text-[#5d5e61] hover:text-[#af101a] hover:bg-[#fef2f2] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export const Button = forwardRef(
  ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
