import { ShieldCheck, AlertTriangle, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card.jsx";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";

export const AdminAnomaliesTab = ({ anomalies, users = [], onRevokeSession }) => {
  return (
    <div className="space-y-4">
      <Card className="rounded-none">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-bold text-[#0f172a]">
            Deteksi Anomali
          </CardTitle>
          <CardDescription className="text-xs text-[#5d5e61] mt-0.5">
            Peringatan login gagal berulang dan aktivitas mencurigakan dalam 24 jam terakhir.
          </CardDescription>
        </CardHeader>
      </Card>

      {anomalies.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center rounded-none">
          <ShieldCheck className="w-10 h-10 text-[#16a34a] mx-auto mb-2" />
          <h4 className="text-sm sm:text-base font-bold text-[#0f172a]">Tidak Ada Anomali</h4>
          <p className="text-xs text-[#5d5e61] max-w-sm mx-auto mt-1 leading-relaxed">
            Semua aktivitas login berjalan normal dalam 24 jam terakhir.
          </p>
        </Card>
      ) : (
        anomalies.map((anom) => (
          <Card
            key={anom.id}
            className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              anom.severity === "CRITICAL"
                ? "border-l-4 border-l-[#ba1a1a] border-[#fecaca] bg-[#fef2f2]/30"
                : anom.severity === "WARNING"
                ? "border-l-4 border-l-[#d97706] border-[#fde68a] bg-[#fffbeb]/30"
                : "border-l-4 border-l-[#0f172a] border-[#e2e8f0]"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 shrink-0 border ${
                  anom.severity === "CRITICAL"
                    ? "bg-[#fef2f2] text-[#ba1a1a] border-[#fecaca]"
                    : anom.severity === "WARNING"
                    ? "bg-[#fffbeb] text-[#d97706] border-[#fde68a]"
                    : "bg-[#f8fafc] text-[#0f172a] border-[#e2e8f0]"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge
                    variant={
                      anom.severity === "CRITICAL"
                        ? "destructive"
                        : anom.severity === "WARNING"
                        ? "warning"
                        : "secondary"
                    }
                    className="font-mono-code text-[10px]"
                  >
                    {anom.severity}
                  </Badge>
                  <span className="text-xs text-[#5d5e61] font-mono-code">
                    {new Date(anom.timestamp).toLocaleString("id-ID")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">{anom.title}</h4>
                <p className="text-xs text-[#5d5e61] mt-0.5 leading-relaxed">{anom.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-[#5d5e61]">
                  <span>Target: <strong className="text-[#0f172a] font-mono-code">{anom.target}</strong></span>
                  {anom.ipAddress !== "-" && (
                    <span>IP: <code className="bg-[#f1f5f9] px-1 py-0.5 border border-[#e2e8f0] text-[#1a1b22] font-mono-code">{anom.ipAddress}</code></span>
                  )}
                  <span>Lokasi: <strong className="text-[#0f172a]">{anom.location}</strong></span>
                </div>
              </div>
            </div>

            {anom.target?.includes("@") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const targetUser = users.find((u) => u.email === anom.target);
                  if (targetUser) {
                    onRevokeSession(targetUser.id, targetUser.email);
                  } else {
                    toast.error("User ID tidak ditemukan dalam daftar aktif");
                  }
                }}
                className="gap-1.5 text-xs font-semibold text-[#af101a] border-[#fecaca] hover:bg-[#fef2f2] hover:border-[#af101a] self-start sm:self-center shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cabut Sesi Akun
              </Button>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
