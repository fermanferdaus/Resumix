import {
  Search,
  ListFilter,
  CheckCircle2,
  XCircle,
  MapPin,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const AdminUsersTab = ({
  usersData,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  usersPage,
  setUsersPage,
  onRevokeSession,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Filter & Search Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pengguna, email, atau domisili..."
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUsersPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ListFilter className="w-3.5 h-3.5" />
            <span>Peran:</span>
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => {
              setUserRoleFilter(e.target.value);
              setUsersPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Semua Peran</option>
            <option value="ADMIN">Hanya Admin</option>
            <option value="USER">Pengguna Biasa</option>
          </select>
        </div>
      </div>

      {/* Tabel Pengguna */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Nama Pengguna & Email</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Jumlah CV (Kuota)</th>
              <th className="py-3 px-4">Sesi Online</th>
              <th className="py-3 px-4">Login Terakhir</th>
              <th className="py-3 px-4 sm:px-6 text-right">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {usersData.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada pengguna yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              usersData.items.map((u) => {
                const cvCount = u.resumesCount || 0;
                const isFullQuota = cvCount >= 5;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Nama Pengguna & Email */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                            {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                            {u.fullName}
                            {u.isVerified ? (
                              <span title="Email Terverifikasi">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              </span>
                            ) : (
                              <span title="Belum Verifikasi">
                                <XCircle className="w-3.5 h-3.5 text-amber-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px]">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Peran (Role) */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          u.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Jumlah CV yang sudah dibuat */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-xs ${
                            isFullQuota ? "text-amber-600" : "text-slate-900"
                          }`}
                        >
                          {cvCount} / 5 CV
                        </span>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${(cvCount / 5) * 100}%` }}
                            className={`h-full rounded-full ${
                              isFullQuota ? "bg-amber-500" : "bg-blue-500"
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Sesi Online */}
                    <td className="py-3.5 px-4">
                      {u.activeSessionsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {u.activeSessionsCount} sesi aktif
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Offline</span>
                      )}
                    </td>

                    {/* Login Terakhir & Lokasi */}
                    <td className="py-3.5 px-4">
                      {u.lastLogin ? (
                        <div>
                          <div className="text-[11px] text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{u.lastLogin.location}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(u.lastLogin.timestamp).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Aksi Kelola */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {u.activeSessionsCount > 0 ? (
                        <button
                          onClick={() => onRevokeSession(u.id, u.email)}
                          title="Paksa logout seluruh sesi akun ini"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                        >
                          <LogOut className="w-3 h-3" />
                          Putuskan Sesi
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Sesi Bersih</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {usersData.meta.totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            Menampilkan halaman <strong>{usersData.meta.page}</strong> dari{" "}
            <strong>{usersData.meta.totalPages}</strong> (Total {usersData.meta.total} pengguna)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={usersPage <= 1}
              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={usersPage >= usersData.meta.totalPages}
              onClick={() => setUsersPage((p) => p + 1)}
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

