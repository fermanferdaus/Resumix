import {
  Search,
  MapPin,
  Smartphone,
  Laptop,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const AdminLogsTab = ({
  logsData,
  logSearch,
  setLogSearch,
  logStatusFilter,
  setLogStatusFilter,
  logsPage,
  setLogsPage,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari IP, email, kota, negara..."
            value={logSearch}
            onChange={(e) => {
              setLogSearch(e.target.value);
              setLogsPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={logStatusFilter}
            onChange={(e) => {
              setLogStatusFilter(e.target.value);
              setLogsPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="SUCCESS">Hanya Berhasil</option>
            <option value="FAILED">Hanya Gagal</option>
          </select>
        </div>
      </div>

      {/* Tabel Log */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Waktu Kejadian</th>
              <th className="py-3 px-4">Pengguna / Email</th>
              <th className="py-3 px-4">Alamat IP</th>
              <th className="py-3 px-4">Geolokasi Terdeteksi</th>
              <th className="py-3 px-4">Perangkat & Browser</th>
              <th className="py-3 px-4 sm:px-6 text-right">Status & Metode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {logsData.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada catatan log aktivitas yang tersedia.
                </td>
              </tr>
            ) : (
              logsData.items.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-mono text-[11px] text-slate-500">
                    {new Date(log.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{log.userName}</div>
                    <div className="text-[11px] text-slate-500">{log.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{log.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-600">
                      {log.device === "Mobile" ? (
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{log.browser || "Unknown"} ({log.device})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        via {log.loginMethod}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {logsData.meta.totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            Halaman <strong>{logsData.meta.page}</strong> dari{" "}
            <strong>{logsData.meta.totalPages}</strong> (Total {logsData.meta.total} log)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={logsPage <= 1}
              onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={logsPage >= logsData.meta.totalPages}
              onClick={() => setLogsPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
