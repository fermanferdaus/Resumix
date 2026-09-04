import { ShieldCheck, AlertTriangle, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export const AdminAnomaliesTab = ({ anomalies, users = [], onRevokeSession }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Pusat Deteksi Anomali & Pembobolan
        </h3>
        <p className="text-xs text-slate-500">
          Sistem secara cerdas memantau lonjakan kegagalan password, serangan brute-force, dan penggunaan token tidak sah.
        </p>
      </div>

      {anomalies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900">Sistem Berjalan Aman</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Tidak terdeteksi aktivitas anomali atau upaya brute-force dalam 24 jam terakhir.
          </p>
        </div>
      ) : (
        anomalies.map((anom) => (
          <div
            key={anom.id}
            className={`p-5 rounded-2xl border shadow-sm transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              anom.severity === "CRITICAL"
                ? "border-rose-300 bg-rose-50/20"
                : anom.severity === "WARNING"
                ? "border-amber-300 bg-amber-50/20"
                : "border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  anom.severity === "CRITICAL"
                    ? "bg-rose-100 text-rose-700"
                    : anom.severity === "WARNING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      anom.severity === "CRITICAL"
                        ? "bg-rose-600 text-white"
                        : anom.severity === "WARNING"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {anom.severity}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(anom.timestamp).toLocaleString("id-ID")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{anom.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{anom.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <span>Target: <strong>{anom.target}</strong></span>
                  {anom.ipAddress !== "-" && <span>IP: <code>{anom.ipAddress}</code></span>}
                  <span>Lokasi: {anom.location}</span>
                </div>
              </div>
            </div>

            {anom.target?.includes("@") && (
              <button
                onClick={() => {
                  const targetUser = users.find((u) => u.email === anom.target);
                  if (targetUser) {
                    onRevokeSession(targetUser.id, targetUser.email);
                  } else {
                    toast.error("User ID tidak ditemukan dalam daftar aktif");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors self-start sm:self-center shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cabut Sesi Akun
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

