import { toMonthInputValue, toDisplayMonthYear } from "../../lib/date.js";

/**
 * Single input Month & Year Picker dengan native HTML5 type="month"
 * Desain presisi Soft Flat 2.0 (identik dengan komponen Input)
 */
export const MonthYearPicker = ({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Pilih Bulan & Tahun",
  id,
}) => {
  const isPresent = String(value || "").toLowerCase() === "sekarang";
  const inputValue = toMonthInputValue(value);

  const handleChange = (e) => {
    const rawVal = e.target.value; // e.g. "2024-06"
    if (!rawVal) {
      onChange("");
      return;
    }
    const formatted = toDisplayMonthYear(rawVal); // e.g. "Juni 2024"
    onChange(formatted);
  };

  if (isPresent || disabled) {
    return (
      <input
        id={id}
        type="text"
        value={isPresent ? "Sekarang" : value || placeholder}
        disabled
        className="w-full bg-[#f1f5f9] rounded-none border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#64748b] font-medium cursor-not-allowed select-none transition-colors"
      />
    );
  }

  return (
    <input
      id={id}
      type="month"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full bg-white rounded-none border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1a1b22] placeholder:text-[#94a3b8] transition-colors focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] cursor-pointer font-sans"
    />
  );
};
