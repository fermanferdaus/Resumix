import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";
import { adminApi } from "../../api/adminApi.js";
import { AdminStatCards } from "../../components/admin/AdminStatCards.jsx";
import { AdminOverviewTab } from "../../components/admin/AdminOverviewTab.jsx";
import { AdminUsersTab } from "../../components/admin/AdminUsersTab.jsx";
import { AdminAnomaliesTab } from "../../components/admin/AdminAnomaliesTab.jsx";
import { AdminLogsTab } from "../../components/admin/AdminLogsTab.jsx";
import { AdminSecurityTab } from "../../components/admin/AdminSecurityTab.jsx";
import { AdminSkeleton } from "../../components/admin/AdminSkeleton.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { cn } from "../../lib/utils.js";
import {
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Users,
  ShieldAlert,
  Globe,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // State Data
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState({ items: [], meta: { page: 1, totalPages: 1, total: 0 } });
  const [anomalies, setAnomalies] = useState([]);
  const [logsData, setLogsData] = useState({ items: [], meta: { page: 1, totalPages: 1, total: 0 } });

  // State Filters, Pagination & Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  // Users Filters & Debounce
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userStartDate, setUserStartDate] = useState("");
  const [userEndDate, setUserEndDate] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserSearch(userSearch.trim());
      setUsersPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [userSearch]);

  // Logs Filters & Debounce
  const [logStatusFilter, setLogStatusFilter] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [debouncedLogSearch, setDebouncedLogSearch] = useState("");
  const [logStartDate, setLogStartDate] = useState("");
  const [logEndDate, setLogEndDate] = useState("");
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit, setLogsLimit] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLogSearch(logSearch.trim());
      setLogsPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [logSearch]);

  // Load Dashboard Overview Stats & Anomalies
  const fetchOverviewData = useCallback(async () => {
    try {
      const [statsRes, anomaliesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAnomalies(),
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (anomaliesRes?.data) setAnomalies(anomaliesRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat statistik admin");
    }
  }, []);

  // Load Users List
  const fetchUsers = useCallback(async (page, limit, search, role, startDate, endDate) => {
    setIsUsersLoading(true);
    try {
      const res = await adminApi.getUsers({
        page,
        limit,
        search,
        role,
        startDate,
        endDate,
      });
      if (res?.data) {
        setUsersData({
          items: res.data,
          meta: res.meta || { page: 1, totalPages: 1, total: res.data.length },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat data pengguna");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  // Load Login Logs
  const fetchLogs = useCallback(async (page, limit, search, status, startDate, endDate) => {
    setIsLogsLoading(true);
    try {
      const res = await adminApi.getLogs({
        page,
        limit,
        status,
        search,
        startDate,
        endDate,
      });
      if (res?.data) {
        setLogsData({
          items: res.data,
          meta: res.meta || { page: 1, totalPages: 1, total: res.data.length },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat log aktivitas");
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  // Initial Data Load (Hanya dieksekusi 1 kali saat mount)
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchOverviewData(),
        fetchUsers(1, usersLimit, "", "", "", ""),
        fetchLogs(1, logsLimit, "", "", "", ""),
      ]);
      setIsLoading(false);
    };
    init();
  }, [fetchOverviewData, fetchUsers, fetchLogs, usersLimit, logsLimit]);

  // Efek Perubahan Filter / Paginasi Pengguna
  const isUsersMounted = useRef(false);
  useEffect(() => {
    if (!isUsersMounted.current) {
      isUsersMounted.current = true;
      return;
    }
    fetchUsers(usersPage, usersLimit, debouncedUserSearch, userRoleFilter, userStartDate, userEndDate);
  }, [usersPage, usersLimit, debouncedUserSearch, userRoleFilter, userStartDate, userEndDate, fetchUsers]);

  // Efek Perubahan Filter / Paginasi Logs
  const isLogsMounted = useRef(false);
  useEffect(() => {
    if (!isLogsMounted.current) {
      isLogsMounted.current = true;
      return;
    }
    fetchLogs(logsPage, logsLimit, debouncedLogSearch, logStatusFilter, logStartDate, logEndDate);
  }, [logsPage, logsLimit, debouncedLogSearch, logStatusFilter, logStartDate, logEndDate, fetchLogs]);

  // Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchOverviewData(),
      fetchUsers(usersPage, usersLimit, debouncedUserSearch, userRoleFilter, userStartDate, userEndDate),
      fetchLogs(logsPage, logsLimit, debouncedLogSearch, logStatusFilter, logStartDate, logEndDate),
    ]);
    setIsRefreshing(false);
    toast.success("Data monitoring berhasil diperbarui");
  };

  // Revoke User Sessions Action
  const handleRevokeSession = async (userPublicId, userEmail) => {
    if (!window.confirm(`Yakin ingin memutuskan seluruh sesi aktif milik ${userEmail}? Pengguna akan dipaksa logout.`)) {
      return;
    }
    try {
      const res = await adminApi.revokeUserSessions(userPublicId);
      toast.success(res.message || "Sesi pengguna berhasil diputuskan");
      fetchUsers(usersPage, usersLimit, debouncedUserSearch, userRoleFilter, userStartDate, userEndDate);
      fetchOverviewData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memutuskan sesi");
    }
  };

  // Kalkulasi Maksimum Tren untuk Skala Grafik SVG
  const maxTrendVal = Math.max(
    ...(stats?.trends || []).map((t) => Math.max(t.logins || 0, t.registrations || 0, t.failed || 0)),
    5
  );

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col font-sans text-[#1a1b22] antialiased rounded-none pt-16">
      <Navbar />

      <main className="flex-1 max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Dashboard Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#e2e8f0]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a]">
              Dashboard Admin
            </h1>
            <p className="text-xs sm:text-sm text-[#5d5e61] mt-0.5">
              Pantau pengguna, kuota CV, aktivitas login, dan keamanan sistem.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2 bg-white text-xs font-semibold text-[#1a1b22] border-[#e2e8f0] hover:border-[#af101a] rounded-none w-full sm:w-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#af101a]" : "text-[#5d5e61]"}`} />
              Segarkan
            </Button>
          </div>
        </div>

        {/* Loading Skeleton Utama atau Tampilan Dashboard */}
        {isLoading ? (
          <AdminSkeleton />
        ) : (
          <>
            {/* 4 Kartu Metrik Utama */}
            <AdminStatCards stats={stats} isLoading={isLoading} />

            {/* Tab Navigation Menggunakan shadcn/ui Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#e2e8f0] pb-2 mb-6 overflow-x-auto whitespace-nowrap">
              <Button
                variant={activeTab === "overview" ? "primary" : "subtle"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className="gap-1.5 text-xs font-semibold rounded-none cursor-pointer shrink-0 whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4" />
                Ringkasan
              </Button>

              <Button
                variant={activeTab === "users" ? "primary" : "subtle"}
                size="sm"
                onClick={() => setActiveTab("users")}
                className="gap-1.5 text-xs font-semibold rounded-none cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                Pengguna
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-none border font-mono-code font-bold",
                    activeTab === "users"
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-white text-[#5d5e61] border-[#e2e8f0]"
                  )}
                >
                  {stats?.overview?.totalUsers || 0}
                </span>
              </Button>

              <Button
                variant={activeTab === "anomalies" ? "primary" : "subtle"}
                size="sm"
                onClick={() => setActiveTab("anomalies")}
                className="gap-1.5 text-xs font-semibold rounded-none cursor-pointer shrink-0 whitespace-nowrap"
              >
                <ShieldAlert className="w-4 h-4" />
                Anomali
                {anomalies.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-[#ba1a1a] text-white font-mono-code font-bold animate-pulse">
                    {anomalies.length}
                  </span>
                )}
              </Button>

              <Button
                variant={activeTab === "logs" ? "primary" : "subtle"}
                size="sm"
                onClick={() => setActiveTab("logs")}
                className="gap-1.5 text-xs font-semibold rounded-none cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Globe className="w-4 h-4" />
                Log Aktivitas
              </Button>

              <Button
                variant={activeTab === "security" ? "primary" : "subtle"}
                size="sm"
                onClick={() => setActiveTab("security")}
                className="gap-1.5 text-xs font-semibold rounded-none cursor-pointer shrink-0 whitespace-nowrap"
              >
                <KeyRound className="w-4 h-4" />
                Keamanan (2FA)
              </Button>
            </div>

            {/* Tab Contents */}
            {activeTab === "overview" && (
              <AdminOverviewTab stats={stats} maxTrendVal={maxTrendVal} />
            )}

            {activeTab === "users" && (
              <AdminUsersTab
                usersData={usersData}
                userSearch={userSearch}
                setUserSearch={setUserSearch}
                userRoleFilter={userRoleFilter}
                setUserRoleFilter={setUserRoleFilter}
                userStartDate={userStartDate}
                setUserStartDate={setUserStartDate}
                userEndDate={userEndDate}
                setUserEndDate={setUserEndDate}
                usersPage={usersPage}
                setUsersPage={setUsersPage}
                usersLimit={usersLimit}
                setUsersLimit={setUsersLimit}
                onRevokeSession={handleRevokeSession}
                isLoading={isUsersLoading}
              />
            )}

            {activeTab === "anomalies" && (
              <AdminAnomaliesTab
                anomalies={anomalies}
                users={usersData.items}
                onRevokeSession={handleRevokeSession}
              />
            )}

            {activeTab === "logs" && (
              <AdminLogsTab
                logsData={logsData}
                logSearch={logSearch}
                setLogSearch={setLogSearch}
                logStatusFilter={logStatusFilter}
                setLogStatusFilter={setLogStatusFilter}
                logStartDate={logStartDate}
                setLogStartDate={setLogStartDate}
                logEndDate={logEndDate}
                setLogEndDate={setLogEndDate}
                logsPage={logsPage}
                setLogsPage={setLogsPage}
                logsLimit={logsLimit}
                setLogsLimit={setLogsLimit}
                isLoading={isLogsLoading}
              />
            )}

            {activeTab === "security" && (
              <AdminSecurityTab />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
