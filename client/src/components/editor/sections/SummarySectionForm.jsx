import { Label } from "../../ui/label.jsx";

export const SummarySectionForm = ({ data, onChange }) => {
  const handleSummaryChange = (value) => {
    onChange({
      ...data,
      summary: value,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      <div>
        <Label htmlFor="summary-text">Ringkasan</Label>
        <textarea
          id="summary-text"
          rows={5}
          placeholder="Tuliskan ringkasan pengalaman profesional, keahlian utama, dan pencapaian Anda secara terstruktur..."
          value={data.summary || ""}
          onChange={(e) => handleSummaryChange(e.target.value)}
          className="w-full bg-white border border-[#e2e8f0] text-xs text-[#0f172a] p-3 rounded-none outline-none focus:border-[#af101a] transition-colors leading-relaxed"
        />
      </div>
    </div>
  );
};
