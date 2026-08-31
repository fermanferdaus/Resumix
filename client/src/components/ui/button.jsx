import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium text-sm transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#d32f2f] text-white hover:bg-[#1a1c1e] active:bg-[#d32f2f] active:border-2 active:border-[#1a1c1e] border border-transparent font-semibold",
        outline:
          "bg-white text-[#1a1b22] border border-[#1a1c1e] hover:bg-[#f1f5f9] active:bg-[#e2e8f0]",
        subtle:
          "bg-white text-[#1a1b22] border border-[#e2e8f0] hover:border-[#1a1c1e] hover:bg-[#f8fafc]",
        ghost:
          "text-[#5d5e61] hover:text-[#d32f2f] hover:bg-transparent underline-offset-4 hover:underline",
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

export const Button = React.forwardRef(
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
