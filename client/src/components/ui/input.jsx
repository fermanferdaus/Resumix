import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

export const Input = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full bg-white rounded-none border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1a1b22] placeholder:text-[#94a3b8] transition-colors focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] disabled:cursor-not-allowed disabled:bg-[#f1f5f9] disabled:text-[#64748b]",
          error && "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#ba1a1a] font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
