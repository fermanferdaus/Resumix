import React from "react";
import { cn } from "../../lib/utils.js";

export const Label = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "block font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#5d5e61] mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";
