import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const alertVariants = cva(
  "w-full p-3.5 text-xs flex items-start gap-2.5 transition-all border rounded-none",
  {
    variants: {
      variant: {
        error: "bg-[#fff1f2] border-[#ba1a1a] text-[#93000a]",
        success: "bg-[#f0fdf4] border-[#15803d] text-[#166534]",
        info: "bg-[#f8fafc] border-[#94a3b8] text-[#334155]",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  }
);

export const Alert = ({
  variant = "error",
  className,
  children,
  onClose,
  title,
  ...props
}) => {
  if (!children) return null;

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">
        {variant === "error" && <AlertCircle className="w-4 h-4 text-[#ba1a1a]" />}
        {variant === "success" && <CheckCircle2 className="w-4 h-4 text-[#15803d]" />}
        {variant === "info" && <Info className="w-4 h-4 text-[#334155]" />}
      </div>

      <div className="flex-1 font-medium leading-relaxed">
        {title && <div className="font-bold text-xs uppercase mb-0.5">{title}</div>}
        <div>{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer -mr-1 -mt-1 p-1 rounded-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
