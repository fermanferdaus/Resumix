import {
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from "lucide-react";

export const AdminOverviewTab = ({ stats, maxTrendVal }) => {
  return (
    <div className="space-y-6">
      {/* Grafik Tren 7 Hari Terakhir */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Aktivitas Sistem 7 Hari Terakhir
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan pendaftaran akun baru, login berhasil, dan percobaan gagal.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Login Sukses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Registrasi Baru</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span>Login Gagal</span>
            </div>
          </div>
        </div>

        {/* Visualisasi Bar Chart SVG Dinamis */}
        <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-slate-100">
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
                    className="w-3 sm:w-4 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all"
                  />
                  {/* Bar Registrasi Baru */}
                  <div
                    style={{ height: `${Math.max(regH, 4)}%` }}
                    title={`Registrasi Baru: ${item.registrations}`}
                    className="w-3 sm:w-4 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all"
                  />
                  {/* Bar Login Gagal */}
                  <div
                    style={{ height: `${Math.max(failH, 4)}%` }}
                    title={`Login Gagal: ${item.failed}`}
                    className="w-3 sm:w-4 bg-rose-400 rounded-t-md hover:bg-rose-500 transition-all"
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-500 tracking-tight text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid 2 Kolom: Perangkat & Kesehatan Sistem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi Perangkat Login */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Distribusi Perangkat Pengguna
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Platform yang digunakan pengguna saat mengakses aplikasi.
          </p>

          <div className="space-y-4">
            {(() => {
              const d = stats?.devices || { desktop: 0, mobile: 0, tablet: 0 };
              const totalDev = (d.desktop || 0) + (d.mobile || 0) + (d.tablet || 0) || 1;
              const pctDesktop = Math.round(((d.desktop || 0) / totalDev) * 100);
              const pctMobile = Math.round(((d.mobile || 0) / totalDev) * 100);
              const pctTablet = Math.round(((d.tablet || 0) / totalDev) * 100);

              return (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Laptop className="w-4 h-4 text-blue-600" /> Desktop
                      </span>
                      <span>{d.desktop || 0} ({pctDesktop}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${pctDesktop}%` }} className="h-full bg-blue-600 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" /> Smartphone
                      </span>
                      <span>{d.mobile || 0} ({pctMobile}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${pctMobile}%` }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Tablet className="w-4 h-4 text-purple-600" /> Tablet
                      </span>
                      <span>{d.tablet || 0} ({pctTablet}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${pctTablet}%` }} className="h-full bg-purple-500 rounded-full" />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Status Sistem & Database */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Integritas & Kesehatan Infrastruktur
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Status koneksi database, port reverse proxy, dan sanitasi sesi.
          </p>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Database PostgreSQL 15
              </span>
              <span className="px-2 py-0.5 font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                Terhubung (Healthy)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Rate Limiter Khusus Admin
              </span>
              <span className="px-2 py-0.5 font-semibold bg-blue-100 text-blue-800 rounded-md">
                60 req / 5 min
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" /> Resolusi Geolokasi IP
              </span>
              <span className="px-2 py-0.5 font-semibold bg-indigo-100 text-indigo-800 rounded-md">
                Offline (geoip-lite)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
