import {
  Search,
  MapPin,
  Smartphone,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
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
import { formatDateTimeWIB } from "../../lib/date.js";

export const AdminLogsTab = ({
  logsData,
  logSearch,
  setLogSearch,
  logStatusFilter,
  setLogStatusFilter,
  logStartDate,
  setLogStartDate,
  logEndDate,
  setLogEndDate,
  logsPage,
  setLogsPage,
  logsLimit = 10,
  setLogsLimit,
  isLoading = false,
}) => {
  return (
    <Card className="overflow-hidden">
      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#f8fafc]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5e61] pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari IP, email, kota, negara..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border-[#e2e8f0] rounded-none focus:border-[#1a1c1e] focus:ring-[#af101a]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5d5e61] font-semibold">Status:</span>
            <select
              value={logStatusFilter}
              onChange={(e) => {
                setLogStatusFilter(e.target.value);
                setLogsPage(1);
              }}
              className="text-xs bg-white border border-[#e2e8f0] rounded-none px-2.5 py-1.5 font-semibold text-[#1a1b22] focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="SUCCESS">Hanya Berhasil</option>
              <option value="FAILED">Hanya Gagal</option>
            </select>
          </div>

          {/* Filter Rentang Tanggal (Tanggal Awal & Tanggal Akhir) */}
          <div className="flex items-center gap-1.5 text-xs text-[#5d5e61] font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#af101a] shrink-0" />
            <span>Periode:</span>
            <Input
              type="date"
              value={logStartDate}
              onChange={(e) => {
                setLogStartDate(e.target.value);
                setLogsPage(1);
              }}
              title="Tanggal Awal"
              className="h-8 w-auto px-2 py-1 text-xs bg-white border-[#e2e8f0] rounded-none font-mono-code focus:border-[#1a1c1e] focus:ring-[#af101a]"
            />
            <span className="text-[#5d5e61]">-</span>
            <Input
              type="date"
              value={logEndDate}
              min={logStartDate || undefined}
              onChange={(e) => {
                setLogEndDate(e.target.value);
                setLogsPage(1);
              }}
              title="Tanggal Akhir"
              className="h-8 w-auto px-2 py-1 text-xs bg-white border-[#e2e8f0] rounded-none font-mono-code focus:border-[#1a1c1e] focus:ring-[#af101a]"
            />
            {(logStartDate || logEndDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLogStartDate("");
                  setLogEndDate("");
                  setLogsPage(1);
                }}
                title="Hapus filter rentang tanggal"
                className="h-8 px-2 text-xs text-[#af101a] hover:bg-[#fef2f2] rounded-none cursor-pointer"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Log via shadcn/ui Table */}
      <Table>
        <TableHeader className="bg-[#f8fafc]">
          <TableRow>
            <TableHead className="py-3 px-4 sm:px-6">Waktu</TableHead>
            <TableHead className="py-3 px-4">Pengguna / Email</TableHead>
            <TableHead className="py-3 px-4">Alamat IP</TableHead>
            <TableHead className="py-3 px-4">Geolokasi Terdeteksi</TableHead>
            <TableHead className="py-3 px-4">Perangkat & Browser</TableHead>
            <TableHead className="py-3 px-4 sm:px-6 text-right">Status & Metode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
              <TableRow key={n} className="animate-pulse">
                <TableCell className="py-3.5 px-4 sm:px-6">
                  <Skeleton className="h-3.5 w-24 bg-[#f1f5f9]" />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-3.5 w-28 bg-[#f1f5f9] mb-1" />
                  <Skeleton className="h-2.5 w-36 bg-[#f8fafc]" />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-3.5 w-24 bg-[#f8fafc]" />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-3.5 w-28 bg-[#f1f5f9]" />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Skeleton className="h-3.5 w-32 bg-[#f8fafc]" />
                </TableCell>
                <TableCell className="py-3.5 px-4 sm:px-6 text-right">
                  <Skeleton className="h-5 w-20 bg-[#f8fafc] ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : logsData.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-[#5d5e61]">
                Tidak ada catatan log aktivitas yang tersedia.
              </TableCell>
            </TableRow>
          ) : (
            logsData.items.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="py-3 px-4 sm:px-6 font-mono-code text-[11px] text-[#5d5e61] whitespace-nowrap">
                  {formatDateTimeWIB(log.createdAt)}
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

      {/* Pagination & Limit Controls via shadcn/ui */}
      <div className="p-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5d5e61] bg-[#f8fafc]">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            Halaman <strong className="text-[#0f172a]">{logsData?.meta?.page || 1}</strong> dari{" "}
            <strong className="text-[#0f172a]">{logsData?.meta?.totalPages || 1}</strong> (Total {logsData?.meta?.total || 0} log)
          </span>
          <div className="flex items-center gap-1.5 font-semibold text-[#5d5e61]">
            <span>Tampilkan:</span>
            <select
              value={logsLimit}
              onChange={(e) => {
                setLogsLimit(Number(e.target.value));
                setLogsPage(1);
              }}
              className="text-xs bg-white border border-[#e2e8f0] rounded-none px-2 py-1 font-semibold text-[#1a1b22] focus:outline-none focus:border-[#1a1c1e] focus:ring-1 focus:ring-[#af101a] cursor-pointer"
            >
              <option value={10}>10 baris</option>
              <option value={25}>25 baris</option>
              <option value={50}>50 baris</option>
              <option value={100}>100 baris</option>
              <option value={500}>500 baris</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            disabled={logsPage <= 1}
            onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
            className="h-8 w-8 p-0 rounded-none border-[#e2e8f0] bg-white text-[#1a1b22] hover:border-[#af101a]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-2 font-mono-code font-bold text-xs text-[#0f172a]">
            {logsData?.meta?.page || 1} / {logsData?.meta?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={logsPage >= (logsData?.meta?.totalPages || 1)}
            onClick={() => setLogsPage((p) => p + 1)}
            className="h-8 w-8 p-0 rounded-none border-[#e2e8f0] bg-white text-[#1a1b22] hover:border-[#af101a]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
