import {
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card.jsx";
import { Badge } from "../ui/badge.jsx";

export const AdminOverviewTab = ({ stats, maxTrendVal }) => {
  return (
    <div className="space-y-6">
      {/* Grafik Tren 7 Hari Terakhir */}
      <Card>
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-[#0f172a]">
                Aktivitas Sistem 7 Hari Terakhir
              </CardTitle>
              <CardDescription className="text-xs text-[#5d5e61] mt-1">
                Perbandingan pendaftaran akun baru, login berhasil, dan percobaan gagal.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-[#5d5e61]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#af101a]" />
                <span>Login Sukses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#16a34a]" />
                <span>Registrasi Baru</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#ba1a1a]" />
                <span>Login Gagal</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          {/* Visualisasi Bar Chart SVG Dinamis */}
          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-[#e2e8f0]">
            {stats?.trends?.map((item, idx) => {
              const loginH = Math.min(100, Math.round(((item.logins || 0) / maxTrendVal) * 100));
              const regH = Math.min(100, Math.round(((item.registrations || 0) / maxTrendVal) * 100));
              const failH = Math.min(100, Math.round(((item.failed || 0) / maxTrendVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="flex items-end gap-1.5 w-full justify-center h-48">
                    {/* Bar Login Sukses */}
                    <div
                      style={{ height: `${Math.max(loginH, 4)}%` }}
                      title={`Login Sukses: ${item.logins}`}
                      className="w-3 sm:w-4 bg-[#af101a] hover:bg-[#8f0d15] transition-all cursor-pointer"
                    />
                    {/* Bar Registrasi Baru */}
                    <div
                      style={{ height: `${Math.max(regH, 4)}%` }}
                      title={`Registrasi Baru: ${item.registrations}`}
                      className="w-3 sm:w-4 bg-[#16a34a] hover:bg-[#15803d] transition-all cursor-pointer"
                    />
                    {/* Bar Login Gagal */}
                    <div
                      style={{ height: `${Math.max(failH, 4)}%` }}
                      title={`Login Gagal: ${item.failed}`}
                      className="w-3 sm:w-4 bg-[#ba1a1a] hover:bg-[#991b1b] transition-all cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] font-mono-code font-medium text-[#5d5e61] tracking-tight text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grid 2 Kolom: Perangkat & Kesehatan Sistem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi Perangkat Login */}
        <Card>
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-bold text-[#0f172a]">
              Distribusi Perangkat Pengguna
            </CardTitle>
            <CardDescription className="text-xs text-[#5d5e61] mt-1">
              Platform yang digunakan pengguna saat mengakses aplikasi.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-4">
            {(() => {
              const d = stats?.devices || { desktop: 0, mobile: 0, tablet: 0 };
              const totalDev = (d.desktop || 0) + (d.mobile || 0) + (d.tablet || 0) || 1;
              const pctDesktop = Math.round(((d.desktop || 0) / totalDev) * 100);
              const pctMobile = Math.round(((d.mobile || 0) / totalDev) * 100);
              const pctTablet = Math.round(((d.tablet || 0) / totalDev) * 100);

              return (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#1a1b22] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Laptop className="w-4 h-4 text-[#af101a]" /> Desktop
                      </span>
                      <span className="font-mono-code">{d.desktop || 0} ({pctDesktop}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden">
                      <div style={{ width: `${pctDesktop}%` }} className="h-full bg-[#af101a]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#1a1b22] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#16a34a]" /> Smartphone
                      </span>
                      <span className="font-mono-code">{d.mobile || 0} ({pctMobile}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden">
                      <div style={{ width: `${pctMobile}%` }} className="h-full bg-[#16a34a]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#1a1b22] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Tablet className="w-4 h-4 text-[#0f172a]" /> Tablet
                      </span>
                      <span className="font-mono-code">{d.tablet || 0} ({pctTablet}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden">
                      <div style={{ width: `${pctTablet}%` }} className="h-full bg-[#0f172a]" />
                    </div>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>

        {/* Status Sistem & Database */}
        <Card>
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-bold text-[#0f172a]">
              Integritas & Kesehatan Infrastruktur
            </CardTitle>
            <CardDescription className="text-xs text-[#5d5e61] mt-1">
              Status koneksi database, port reverse proxy, dan sanitasi sesi.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-3">
            <div className="flex items-center justify-between p-3 border border-[#e2e8f0] bg-[#f8fafc]">
              <span className="font-semibold text-xs text-[#1a1b22] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a]" /> Database PostgreSQL 15
              </span>
              <Badge variant="success" className="font-mono-code">
                Terhubung (Healthy)
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-[#e2e8f0] bg-[#f8fafc]">
              <span className="font-semibold text-xs text-[#1a1b22] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#af101a]" /> Rate Limiter Khusus Admin
              </span>
              <Badge variant="outline" className="font-mono-code text-[#0f172a]">
                60 req / 5 min
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-[#e2e8f0] bg-[#f8fafc]">
              <span className="font-semibold text-xs text-[#1a1b22] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0f172a]" /> Resolusi Geolokasi IP
              </span>
              <Badge variant="secondary" className="font-mono-code">
                Offline (geoip-lite)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
