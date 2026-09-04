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
import { Card } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Skeleton } from "../ui/skeleton.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx";

export const AdminUsersTab = ({
  usersData,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  usersPage,
  setUsersPage,
  onRevokeSession,
  isLoading = false,
}) => {
  return (
    <Card className="overflow-hidden">
      {/* Filter & Search Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8fafc]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5e61] pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari nama pengguna, email, atau domisili..."
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUsersPage(1);
            }}
            className="pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border-[#e2e8f0] rounded-none focus:border-[#1a1c1e] focus:ring-[#af101a]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#5d5e61] font-semibold">
            <ListFilter className="w-3.5 h-3.5 text-[#af101a]" />
            <span>Peran:</span>
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => {
              setUserRoleFilter(e.target.value);
              setUsersPage(1);
            }}
            className="text-xs bg-white border border-[#e2e8f0] rounded-none px-3 py-2 font-semibold text-[#1a1b22] focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] cursor-pointer"
          >
            <option value="">Semua Peran</option>
            <option value="ADMIN">Hanya Admin</option>
            <option value="USER">Pengguna Biasa</option>
          </select>
        </div>
      </div>

      {/* Tabel Pengguna via shadcn/ui Table */}
      <Table>
        <TableHeader className="bg-[#f8fafc]">
          <TableRow>
            <TableHead className="py-3 px-4 sm:px-6">Nama Pengguna & Email</TableHead>
            <TableHead className="py-3 px-4">Peran</TableHead>
            <TableHead className="py-3 px-4">Jumlah CV (Kuota)</TableHead>
            <TableHead className="py-3 px-4">Sesi Online</TableHead>
            <TableHead className="py-3 px-4">Login Terakhir</TableHead>
            <TableHead className="py-3 px-4 sm:px-6 text-right">Aksi Kelola</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [1, 2, 3, 4, 5].map((n) => (
              <TableRow key={n} className="animate-pulse">
                <TableCell className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 bg-[#f1f5f9] rounded-none" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 bg-[#f1f5f9]" />
                      <Skeleton className="h-3 w-44 bg-[#f8fafc]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Skeleton className="h-5 w-16 bg-[#f1f5f9]" />
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16 bg-[#f1f5f9]" />
                    <Skeleton className="h-2 w-20 bg-[#f8fafc]" />
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Skeleton className="h-5 w-20 bg-[#f8fafc]" />
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24 bg-[#f1f5f9]" />
                    <Skeleton className="h-2.5 w-16 bg-[#f8fafc]" />
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 sm:px-6 text-right">
                  <Skeleton className="h-7 w-24 bg-[#f8fafc] ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : usersData.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-[#5d5e61]">
                Tidak ada pengguna yang cocok dengan kriteria pencarian.
              </TableCell>
            </TableRow>
          ) : (
            usersData.items.map((u) => {
              const cvCount = u.resumesCount || 0;
              const isFullQuota = cvCount >= 5;

              return (
                <TableRow key={u.id}>
                  {/* Nama Pengguna & Email */}
                  <TableCell className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-9 h-9 object-cover border border-[#e2e8f0] rounded-none"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-[#fef2f2] text-[#af101a] font-bold text-xs flex items-center justify-center border border-[#fecaca] font-mono-code rounded-none">
                          {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#0f172a] text-sm flex items-center gap-1.5">
                          {u.fullName}
                          {u.isVerified ? (
                            <span title="Email Terverifikasi">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                            </span>
                          ) : (
                            <span title="Belum Verifikasi">
                              <XCircle className="w-3.5 h-3.5 text-[#d97706]" />
                            </span>
                          )}
                        </div>
                        <div className="text-[#5d5e61] text-[11px] font-mono-code">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Peran (Role) */}
                  <TableCell className="py-3.5 px-4">
                    <Badge variant={u.role === "ADMIN" ? "admin" : "secondary"} className="font-mono-code text-[11px]">
                      {u.role}
                    </Badge>
                  </TableCell>

                  {/* Jumlah CV yang sudah dibuat */}
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono-code font-bold text-xs ${
                          isFullQuota ? "text-[#af101a]" : "text-[#0f172a]"
                        }`}
                      >
                        {cvCount} / 5 CV
                      </span>
                      <div className="w-16 h-2 bg-[#f1f5f9] border border-[#e2e8f0] rounded-none overflow-hidden">
                        <div
                          style={{ width: `${(cvCount / 5) * 100}%` }}
                          className={`h-full rounded-none ${
                            isFullQuota ? "bg-[#af101a]" : "bg-[#0f172a]"
                          }`}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Sesi Online */}
                  <TableCell className="py-3.5 px-4">
                    {u.activeSessionsCount > 0 ? (
                      <Badge variant="success" className="gap-1 font-mono-code text-[10px]">
                        <span className="w-1.5 h-1.5 bg-[#16a34a] animate-pulse" />
                        {u.activeSessionsCount} sesi aktif
                      </Badge>
                    ) : (
                      <span className="text-[#5d5e61] text-xs font-mono-code">Offline</span>
                    )}
                  </TableCell>

                  {/* Login Terakhir & Lokasi */}
                  <TableCell className="py-3.5 px-4">
                    {u.lastLogin ? (
                      <div>
                        <div className="text-xs text-[#1a1b22] font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#af101a]" />
                          <span>{u.lastLogin.location}</span>
                        </div>
                        <div className="text-[11px] text-[#5d5e61] font-mono-code mt-0.5">
                          {new Date(u.lastLogin.timestamp).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#5d5e61] text-xs">-</span>
                    )}
                  </TableCell>

                  {/* Aksi Kelola */}
                  <TableCell className="py-3.5 px-4 sm:px-6 text-right">
                    {u.activeSessionsCount > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRevokeSession(u.id, u.email)}
                        title="Paksa logout seluruh sesi akun ini"
                        className="gap-1.5 h-8 px-3 text-xs font-semibold text-[#af101a] border-[#fecaca] hover:bg-[#fef2f2] hover:border-[#af101a] rounded-none cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Putuskan Sesi
                      </Button>
                    ) : (
                      <span className="text-[#5d5e61] text-xs font-mono-code">Sesi Bersih</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls via shadcn/ui Button */}
      {usersData.meta.totalPages > 1 && (
        <div className="p-4 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#5d5e61] bg-[#f8fafc]">
          <span>
            Menampilkan halaman <strong className="text-[#0f172a]">{usersData.meta.page}</strong> dari{" "}
            <strong className="text-[#0f172a]">{usersData.meta.totalPages}</strong> (Total {usersData.meta.total} pengguna)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={usersPage <= 1}
              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0 rounded-none border-[#e2e8f0] bg-white text-[#1a1b22] hover:border-[#af101a]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={usersPage >= usersData.meta.totalPages}
              onClick={() => setUsersPage((p) => p + 1)}
              className="h-8 w-8 p-0 rounded-none border-[#e2e8f0] bg-white text-[#1a1b22] hover:border-[#af101a]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
