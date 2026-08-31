import { useRef } from "react";
import { cn } from "../../lib/utils.js";

export const OtpInput = ({ length = 6, value = "", onChange, error, disabled = false }) => {
  const inputRefs = useRef([]);

  const digits = (value || "").split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    // Take the last character typed
    newDigits[index] = val.slice(-1);
    const newValue = newDigits.join("").trim();
    onChange(newValue);

    // Auto advance focus
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
            className={cn(
              "otp-box",
              error && "border-[#ba1a1a] focus:ring-[#ba1a1a]",
              disabled && "bg-[#f1f5f9] cursor-not-allowed opacity-60"
            )}
            autoFocus={index === 0}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-[#ba1a1a] font-medium">{error}</p>}
    </div>
  );
};
