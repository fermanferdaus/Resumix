import {
  Search,
  MapPin,
  Smartphone,
  Laptop,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx";

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
    <Card className="overflow-hidden">
      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8fafc]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5e61] pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari IP, email, kota, negara..."
            value={logSearch}
            onChange={(e) => {
              setLogSearch(e.target.value);
              setLogsPage(1);
            }}
            className="pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border-[#e2e8f0] rounded-none focus:border-[#1a1c1e] focus:ring-[#af101a]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5d5e61] font-semibold">Status:</span>
          <select
            value={logStatusFilter}
            onChange={(e) => {
              setLogStatusFilter(e.target.value);
              setLogsPage(1);
            }}
            className="text-xs bg-white border border-[#e2e8f0] rounded-none px-3 py-2 font-semibold text-[#1a1b22] focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="SUCCESS">Hanya Berhasil</option>
            <option value="FAILED">Hanya Gagal</option>
          </select>
        </div>
      </div>

      {/* Tabel Log via shadcn/ui Table */}
      <Table>
        <TableHeader className="bg-[#f8fafc]">
          <TableRow>
            <TableHead className="py-3 px-4 sm:px-6">Waktu Kejadian</TableHead>
            <TableHead className="py-3 px-4">Pengguna / Email</TableHead>
            <TableHead className="py-3 px-4">Alamat IP</TableHead>
            <TableHead className="py-3 px-4">Geolokasi Terdeteksi</TableHead>
            <TableHead className="py-3 px-4">Perangkat & Browser</TableHead>
            <TableHead className="py-3 px-4 sm:px-6 text-right">Status & Metode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logsData.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-[#5d5e61]">
                Tidak ada catatan log aktivitas yang tersedia.
              </TableCell>
            </TableRow>
          ) : (
            logsData.items.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="py-3 px-4 sm:px-6 font-mono-code text-[11px] text-[#5d5e61]">
                  {new Date(log.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="font-bold text-[#0f172a] text-xs">{log.userName}</div>
                  <div className="text-[11px] text-[#5d5e61] font-mono-code">{log.email}</div>
                </TableCell>
                <TableCell className="py-3 px-4 font-mono-code text-[#1a1b22] text-[11px]">
                  {log.ipAddress}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-medium text-[#1a1b22] text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
                    <span>{log.location}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-1 text-[#5d5e61] text-xs">
                    {log.device === "Mobile" ? (
                      <Smartphone className="w-3.5 h-3.5 text-[#5d5e61]" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-[#5d5e61]" />
                    )}
                    <span>{log.browser || "Unknown"} ({log.device})</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4 sm:px-6 text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <Badge
                      variant={log.status === "SUCCESS" ? "success" : "destructive"}
                      className="font-mono-code text-[10px]"
                    >
                      {log.status}
                    </Badge>
                    <span className="text-[10px] text-[#5d5e61] font-mono-code">
                      via {log.loginMethod}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls via shadcn/ui Button */}
      {logsData.meta.totalPages > 1 && (
        <div className="p-4 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#5d5e61] bg-[#f8fafc]">
          <span>
            Halaman <strong className="text-[#0f172a]">{logsData.meta.page}</strong> dari{" "}
            <strong className="text-[#0f172a]">{logsData.meta.totalPages}</strong> (Total {logsData.meta.total} log)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={logsPage <= 1}
              onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0 rounded-none border-[#e2e8f0] bg-white text-[#1a1b22] hover:border-[#af101a]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={logsPage >= logsData.meta.totalPages}
              onClick={() => setLogsPage((p) => p + 1)}
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
