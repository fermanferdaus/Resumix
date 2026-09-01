import { YEARS } from "../../lib/date.js";
import { cn } from "../../lib/utils.js";

/**
 * Single input Year-only Picker dengan Soft Flat 2.0 styles
 */
export const YearPicker = ({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Pilih Tahun",
  className,
  id,
}) => {
  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full bg-white rounded-none border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1a1b22] placeholder:text-[#94a3b8] transition-colors focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] cursor-pointer appearance-none pr-8 font-mono-code disabled:cursor-not-allowed disabled:bg-[#f1f5f9] disabled:text-[#64748b]",
          className
        )}
      >
        <option value="">-- {placeholder} --</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#5d5e61]">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};
